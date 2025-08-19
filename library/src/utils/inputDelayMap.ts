import { DataChannelSignalQuality } from "../enums";
import { IDelayMap } from "../interfaces";

const SIGNAL_QUALITY_MAP: { [signal: string]: DataChannelSignalQuality } = {
    ['0']: DataChannelSignalQuality.DISABLED,
    ['1']: DataChannelSignalQuality.VERY_LOW,
    ['2']: DataChannelSignalQuality.LOW,
    ['3']: DataChannelSignalQuality.MIDDLE,
    ['4']: DataChannelSignalQuality.HIGH,
    ['5']: DataChannelSignalQuality.VERY_HIGH,
};

export const inputDelayMap = (map?: IDelayMap): IDelayMap | undefined => {
    if (!map) {
        return undefined;
    }
    const result = new Object();
    for (const signal in map) {
        const value = SIGNAL_QUALITY_MAP[signal];
        Object.defineProperty(result, signal, {
            value,
            writable: false,
        });
    }
    return result as IDelayMap;
}