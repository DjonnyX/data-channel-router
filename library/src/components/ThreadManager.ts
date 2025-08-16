import { DEFAULT_MAX_THREADS } from "../const";
import { ThreadEvents } from "../enums";
import { ThreadManagerEvents } from "../enums/ThreadManagerEvents";
import { IThreadManagerOptions } from "../interfaces";
import { EventEmitter } from "../utils";
import { Thread } from "./Thread";

type Events = typeof ThreadManagerEvents.STARTED | typeof ThreadManagerEvents.COMPLITED;

type OnStartedListener = (thread: Thread) => void;

type OnCompletedListener = (thread: Thread) => void;

type Listeners = OnStartedListener | OnCompletedListener;

/**
 * Thread manager
 * @link https://github.com/DjonnyX/data-channel-router/blob/main/library/src/components/ThreadManager.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export class ThreadManager extends EventEmitter<Events, Listeners> {
    private _threadQueue: Array<Thread> = [];

    private _maxThreads: number = DEFAULT_MAX_THREADS;
    get maxThreads() { return this._maxThreads; }

    private _threadsInWork: number = 0;
    get threadsInWork() { return this._threadsInWork; }

    private _rejectedThreads: number = 0;
    get rejectedThreads() { return this._rejectedThreads; }

    private _complitedThreads: number = 0;
    get complitedThreads() { return this._complitedThreads; }

    get finishedThreads() { return this._complitedThreads + this._rejectedThreads; }

    private _onThreadStartedHandler = () => {
        this._threadsInWork++;

        if (this._threadsInWork > this._maxThreads) {
            throw Error('The number of threads has exceeded the maximum value.');
        }
    };

    private _onThreadRejectedHandler = (thread: Thread) => {
        this._threadsInWork--;
        this._rejectedThreads++;
        this.removeThread(thread);
        this.startNextThreadIfNeed();
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
            this._maxThreads = options.maxThreads ?? DEFAULT_MAX_THREADS;
        }
    }

    add(thread: Thread) {
        this._threadQueue.push(thread);
    }

    run() {
        for (let i = 0, l = this._threadQueue.length > this._maxThreads ? this._maxThreads : this._threadQueue.length; i < l; i++) {
            const thread = this._threadQueue[i];
            this.startThread(thread);
        }
    }

    protected startNextThreadIfNeed() {
        if (this._threadQueue.length > 0 && this._threadsInWork < this._maxThreads) {
            const thread = this._threadQueue.shift();
            this.startThread(thread);
        }
    }

    protected startThread(thread: Thread) {
        if (!thread) {
            return;
        }
        thread.addEventListener(ThreadEvents.STARTED, this._onThreadStartedHandler);
        thread.addEventListener(ThreadEvents.REJECTED, this._onThreadRejectedHandler);
        thread.addEventListener(ThreadEvents.COMPLITED, this._onThreadComplitedHandler);
        thread.start();
    }

    protected removeThread(thread: Thread) {
        if (!thread) {
            return;
        }
        const index = this._threadQueue.findIndex((t => t === thread));
        if (index > -1) {
            this._threadQueue.splice(index, 1);
            thread.removeAllListeners();
        }
    }

    dispose() {
        while (this._threadQueue.length > 0) {
            const thread = this._threadQueue.pop();
            thread.dispose();
        }
    }
}
