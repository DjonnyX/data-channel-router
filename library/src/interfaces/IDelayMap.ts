import { DataChannelSignalQuality } from "../enums";

/**
 * Delay map interface
 * @link https://github.com/DjonnyX/data-channel-router/blob/main/library/src/interfaces/IDelayMap.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IDelayMap {
    [DataChannelSignalQuality.VERY_HIGH]: number;
    [DataChannelSignalQuality.HIGH]: number;
    [DataChannelSignalQuality.MIDDLE]: number;
    [DataChannelSignalQuality.LOW]: number;
    [DataChannelSignalQuality.VERY_LOW]: number;
}