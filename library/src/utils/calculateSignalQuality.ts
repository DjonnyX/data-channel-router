import { DataChannelSignalQuality } from "../enums";
import { IDelayMap } from "../interfaces/IDelayMap";

const VERY_HIGH = 25,
    HIGH = 100,
    MIDDLE = 500,
    LOW = 1000;

/**
 * calculateSignalQuality
 * @link https://github.com/DjonnyX/data-channel-router/blob/main/library/src/utils/calculateSignalQuality.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export const calculateSignalQuality = (delay: number, delayMap?: IDelayMap): DataChannelSignalQuality => {
    if (delay < 0) {
        return DataChannelSignalQuality.DISABLED;
    }
    if (delay >= 0 && delay < (delayMap?.[DataChannelSignalQuality.VERY_HIGH] ?? VERY_HIGH)) {
        return DataChannelSignalQuality.VERY_HIGH;
    }
    if (delay > (delayMap?.[DataChannelSignalQuality.VERY_HIGH] ?? VERY_HIGH) && delay <= (delayMap?.[DataChannelSignalQuality.HIGH] ?? HIGH)) {
        return DataChannelSignalQuality.HIGH;
    }
    if (delay > (delayMap?.[DataChannelSignalQuality.HIGH] ?? HIGH) && delay <= (delayMap?.[DataChannelSignalQuality.MIDDLE] ?? MIDDLE)) {
        return DataChannelSignalQuality.MIDDLE;
    }
    if (delay > (delayMap?.[DataChannelSignalQuality.MIDDLE] ?? MIDDLE) && delay <= (delayMap?.[DataChannelSignalQuality.LOW] ?? LOW)) {
        return DataChannelSignalQuality.LOW;
    }
    return DataChannelSignalQuality.VERY_LOW;
}