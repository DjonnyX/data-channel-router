/**
 * Thread manager options interface
 * @link https://github.com/DjonnyX/data-channel-router/blob/main/src/interfaces/IThreadManagerOptions.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IThreadManagerOptions {
    /**
     * Maximum number of parallel threads
     */
    maxThreads?: number;
}