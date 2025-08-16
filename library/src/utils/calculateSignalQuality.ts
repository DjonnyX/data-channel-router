import { DataChannelSignalQuality } from "../enums";

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
export const calculateSignalQuality = (delay: number): DataChannelSignalQuality => {
    if (delay < 0) {
        return DataChannelSignalQuality.DISABLED;
    }
    if (delay >= 0 && delay < VERY_HIGH) {
        return DataChannelSignalQuality.VERY_HIGH;
    }
    if (delay > VERY_HIGH && delay <= HIGH) {
        return DataChannelSignalQuality.HIGH;
    }
    if (delay > HIGH && delay <= MIDDLE) {
        return DataChannelSignalQuality.MIDDLE;
    }
    if (delay > MIDDLE && delay <= LOW) {
        return DataChannelSignalQuality.LOW;
    }
    return DataChannelSignalQuality.VERY_LOW;
}