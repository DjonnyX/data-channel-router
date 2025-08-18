import { DataChannelSignalQuality, DataChannelStatuses } from "../enums";

/**
 * Data channel stats interface
 * @link https://github.com/DjonnyX/data-channel-router/blob/main/library/src/interfaces/IDataChannelsStats.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IDataChannelsStats {
    [channelId: number]: { status: DataChannelStatuses, signal: DataChannelSignalQuality };
    [channelId: string]: { status: DataChannelStatuses, signal: DataChannelSignalQuality };
}