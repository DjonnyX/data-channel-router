/**
 * Create router util
 * @link https://github.com/DjonnyX/data-channel-router/blob/main/library/src/utils/createRouter.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export const createRouter = <R>(routes: R) => {
    const router = new Object();
    for (const route in routes) {
        const handler = routes[route];
        Object.defineProperty(router, route, {
            value: handler,
            writable: false,
        });
    }
    return router as R;
}