import { DEFAULT_MAX_THREADS } from "../const";
import { ThreadEvents } from "../enums";
import { ThreadManagerEvents } from "../enums/ThreadManagerEvents";
import { IThreadManagerOptions } from "../interfaces";
import { EventEmitter } from "../utils";
import { Thread } from "./Thread";

type Events = typeof ThreadManagerEvents.STARTED | typeof ThreadManagerEvents.COMPLITED | typeof ThreadManagerEvents.BUFFERING;

type OnStartedListener = (thread: Thread) => void;

type OnCompletedListener = (thread: Thread) => void;

type OnBufferingListener = (bufferSize: number) => void;

type Listeners = OnStartedListener | OnCompletedListener | OnBufferingListener;

/**
 * Thread manager
 * @link https://github.com/DjonnyX/data-channel-router/blob/main/library/src/components/ThreadManager.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export class ThreadManager extends EventEmitter<Events, Listeners> {
    private _threadQueue: Array<Thread> = [];

    private _processingThreadQueue: Array<Thread> = [];

    private _maxThreads: number = DEFAULT_MAX_THREADS;
    get maxThreads() { return this._maxThreads; }

    private _threadsInWork: number = 0;
    get threadsInWork() { return this._threadsInWork; }

    private _rejectedThreads: number = 0;
    get rejectedThreads() { return this._rejectedThreads; }

    private _complitedThreads: number = 0;
    get complitedThreads() { return this._complitedThreads; }

    get finishedThreads() { return this._complitedThreads + this._rejectedThreads; }

    get buffering() {
        return this._threadQueue.length;
    }

    private _paused = true;

    private _onThreadStartedHandler = () => {
        this._threadsInWork++;
    };

    private _onThreadRejectedHandler = (thread: Thread) => {
        this._threadsInWork--;
        this._rejectedThreads++;
        this.removeThread(thread);
        this.startNextThreadIfNeed();
    };

    private _onThreadWaitForConnectionHandler = (thread: Thread) => {
        this._threadsInWork--;
        thread.removeAllListeners();
    };

    private _onThreadComplitedHandler = (thread: Thread) => {
        this._threadsInWork--;
        this._complitedThreads++;
        this.removeThread(thread);
        this.startNextThreadIfNeed();
    };

    constructor(options?: IThreadManagerOptions) {
        super();
        if (options?.maxThreads) {
            this._maxThreads = options.maxThreads && options.maxThreads > 0 ? options.maxThreads : DEFAULT_MAX_THREADS;
        }
    }

    add(thread: Thread) {
        this._threadQueue.push(thread);
        const isChanged = this.startNextThreadIfNeed();
        if (!isChanged) {
            this.dispatch(ThreadManagerEvents.BUFFERING, this.buffering);
        }
    }

    run() {
        this._paused = false;
        this.dispatch(ThreadManagerEvents.STARTED);
        this.startNextThreadIfNeed();
    }

    play() {
        this._paused = false;
        this.startNextThreadIfNeed();
    }

    pause() {
        this._paused = true;
    }

    protected startNextThreadIfNeed(): boolean {
        if (this._paused) {
            return false;
        }
        const waitToConnectionStarted: Array<Thread> = [];
        let processingThreadQueueLength = this._processingThreadQueue.length, isChanged = false;
        while (processingThreadQueueLength > 0 && this._threadsInWork < this._maxThreads) {
            processingThreadQueueLength--;
            if (this._processingThreadQueue[0].hasEventListener(ThreadEvents.STARTED, this._onThreadStartedHandler)) {
                continue;
            }
            const thread = this._processingThreadQueue.shift();
            waitToConnectionStarted.push(thread);
            this.startThread(thread);
        }
        while (this._threadQueue.length > 0 && this._threadsInWork < this._maxThreads) {
            isChanged = true;
            const thread = this._threadQueue.shift(), started = waitToConnectionStarted.includes(thread);
            if (!started) {
                this._processingThreadQueue.push(thread);
            }
            this.startThread(thread, started);
        }
        if (isChanged) {
            this.dispatch(ThreadManagerEvents.BUFFERING, this.buffering);
        }
        return isChanged;
    }

    protected startThread(thread: Thread, started = false) {
        if (!thread) {
            return;
        }
        if (!started) {
            thread.addEventListener(ThreadEvents.STARTED, this._onThreadStartedHandler);
            thread.addEventListener(ThreadEvents.REJECTED, this._onThreadRejectedHandler);
            thread.addEventListener(ThreadEvents.WAIT_FOR_CONNECTION, this._onThreadWaitForConnectionHandler);
            thread.addEventListener(ThreadEvents.COMPLITED, this._onThreadComplitedHandler);
        }
        thread.start();
    }

    protected removeThread(thread: Thread) {
        if (!thread) {
            return;
        }
        const index = this._processingThreadQueue.findIndex((t => t === thread));
        if (index > -1) {
            this._processingThreadQueue.splice(index, 1);
            thread.dispose();
        }
    }

    dispose() {
        this._paused = true;

        while (this._threadQueue.length > 0) {
            const thread = this._threadQueue.pop();
            thread.dispose();
        }
    }
}
