import { Thread } from "../components/Thread";
import { ThreadManager } from "../components/ThreadManager";

/**
 * Create router util
 * @link https://github.com/DjonnyX/data-channel-router/blob/main/library/src/utils/createRouter.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export const createRouter = <R>(routes: R, threadManager: ThreadManager) => {
    const router = new Object();
    for (const route in routes) {
        const handler = routes[route] as Function;
        Object.defineProperty(router, route, {
            value: (...args: Array<any>) => {
                const thread = new Thread({
                    onStart: async () => {
                        try {
                            await handler(...args);
                            thread.complete();
                        } catch (err) {
                            thread.reject();
                        }
                    }
                })
                threadManager.add(thread);
            },
            writable: false,
        });
    }
    return router as R;
}