export const executeHandler = (handler: Function, ...args: Array<any>) => {
    if (handler === undefined || handler === null) {
        console.warn('The handler is not defined.');
        return;
    }
    return handler(...args);
};
