import { DataChannelSignalQuality, DataChannelStatuses } from "../enums";
import { Id } from "../types";

/**
 * IDataChannelInfo interface
 * @link https://github.com/DjonnyX/data-channel-router/blob/main/library/src/interfaces/IDataChannelInfo.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IDataChannelInfo {
    id: Id;
    signal: DataChannelSignalQuality;
    status: DataChannelStatuses;
}