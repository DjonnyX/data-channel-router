export const inputNumber = (value: any, defaultValue: number): number => {
    const v = parseInt(`${value}`);
    if (typeof value === 'number') {
        return v || defaultValue;
    }
    return defaultValue;
}