import { ThreadEvents } from "../enums";
import { IThreadOptions } from "../interfaces";
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
    private _onStart: () => void;

    constructor(options?: IThreadOptions) {
        super();
        if (options?.onStart !== undefined) {
            this._onStart = options.onStart;
        }
    }

    start() {
        this.dispatch(ThreadEvents.STARTED, this);
        if (this._onStart !== undefined) {
            this._onStart();
        }
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
