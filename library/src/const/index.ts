import { DataChannelSignalQuality } from "../enums";

export const DEFAULT_MAX_THREADS = 4;

export const DEFAULT_PING_TIMEOUT = 10000;

export const DEFAULT_CHECK_TIMEOUT_AFTER_COMPLETE = 100;

export const DATA_CHANNEL_SIGNAL_QUALITY_LIST = [
    DataChannelSignalQuality.VERY_HIGH,
    DataChannelSignalQuality.HIGH,
    DataChannelSignalQuality.MIDDLE,
    DataChannelSignalQuality.LOW,
    DataChannelSignalQuality.VERY_LOW,
    DataChannelSignalQuality.DISABLED,
];