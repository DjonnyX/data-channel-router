import { DEFAULT_MAX_THREADS } from "../const";
import { IThreadManagerOptions } from "../interfaces";

/**
 * Thread manager
 * @link https://github.com/DjonnyX/data-channel-router/blob/main/src/components/ThreadManager.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export class ThreadManager {
    private _maxThreads: number = DEFAULT_MAX_THREADS;
    get maxThreads() { return this._maxThreads; }

    constructor(options?: IThreadManagerOptions) {
        if (options?.maxThreads) {
            this._maxThreads = options.maxThreads ?? DEFAULT_MAX_THREADS;
        }
    }
}
