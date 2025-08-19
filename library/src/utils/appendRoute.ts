import { DataChannelRouter } from "../components";
import { Thread } from "../components/Thread";
import { ThreadManager } from "../components/ThreadManager";
import { DataChannelRouterEvents } from "../enums";

/**
 * Append route util
 * @link https://github.com/DjonnyX/data-channel-router/blob/main/library/src/utils/appendRoute.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export const appendRoute = <R>(router: Object, routes: R, threadManager: ThreadManager, ctx: DataChannelRouter) => {
    for (const route in routes) {
        if (router.hasOwnProperty(route)) {
            continue;
        }
        Object.defineProperty(router, route, {
            value: (...args: Array<any>) => {
                const thread = new Thread({
                    onStart: async () => {
                        if (ctx.activeChannel) {
                            const handler = ctx.activeChannel.router?.[route] as Function;
                            if (!handler) {
                                ctx.dispatch(DataChannelRouterEvents.ROUTE_ERROR, route, ctx.activeChannel.id);
                                thread.reject();
                                console.warn(`Route ${route} is not implemented in data channel id:${ctx.activeChannel.id}.`);
                            }
                            try {
                                await handler(...args);
                                thread.complete();
                            } catch (e) {
                                thread.reject();
                            }
                        } else {
                            console.error(`When calling route ${route}, no available communication channels were found.`);
                            thread.waitForConnect();
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