/**
 * Class finalizer
 * @link https://github.com/DjonnyX/data-channel-router/blob/main/src/utils/ClassFinalizer.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export function final<T extends { new(...args: any[]): object }>(target: T) {
    return class Final extends target {
        constructor(...args: any[]) {
            if (new.target !== Final) {
                throw new Error(`Cannot extend a final class "${target.name}"`);
            }
            super(...args);
        }
    };
}