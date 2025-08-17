import { ThreadEvents } from "../enums";
import { IThreadOptions } from "../interfaces";
import { Id } from "../types";
import { EventEmitter } from "../utils";

type Events = typeof ThreadEvents.STARTED | typeof ThreadEvents.REJECTED | typeof ThreadEvents.COMPLITED;

type OnStartedListener = (thread: Thread) => void;

type OnRejectedListener = (thread: Thread) => void;

type OnComplitedListener = (thread: Thread) => void;

type Listeners = OnStartedListener | OnRejectedListener | OnComplitedListener;

/**
 * Thread
 * @link https://github.com/DjonnyX/data-channel-router/blob/main/library/src/components/Thread.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export class Thread extends EventEmitter<Events, Listeners> {
    private static __nextId: number = 0;

    private _id: Id;
    get id() { return this._id; }

    private _onStart: () => void;
    set onStart(v: () => void) {
        if (this._onStart !== v) {
            this._onStart = v;
        }
    }

    constructor(options?: IThreadOptions) {
        super();
        if (options?.onStart !== undefined) {
            this._onStart = options.onStart;
        }
        this._id = Thread.__nextId;
        Thread.__nextId = Thread.__nextId === Number.MAX_SAFE_INTEGER ? 0 : Thread.__nextId + 1;
    }

    start() {
        if (this._onStart !== undefined) {
            this._onStart();
        }
        this.dispatch(ThreadEvents.STARTED, this);
    }

    reject() {
        this.dispatch(ThreadEvents.REJECTED, this);
    }

    complete() {
        this.dispatch(ThreadEvents.COMPLITED, this);
    }

    dispose() {
        super.dispose();
    }
}
