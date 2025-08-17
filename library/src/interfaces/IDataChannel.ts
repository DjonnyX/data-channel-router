import { DataChannelStatuses } from "../enums";
import { Id } from "../types";
import { IEventEmitter } from "../utils";

/**
 * DataChannelRouter interface
 * @link https://github.com/DjonnyX/data-channel-router/blob/main/library/src/interfaces/IDataChannel.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IDataChannel<R = any> extends IEventEmitter {
    get id(): Id;
    get status(): DataChannelStatuses;
    get router(): R;
}