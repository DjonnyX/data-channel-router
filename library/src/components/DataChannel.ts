import { DataChannelEvents } from "../enums";
import { IDataChannelOptions } from "../interfaces";
import { Id } from "../types";
import { EventEmitter, final } from "../utils";

type ChannelEvents = typeof DataChannelEvents.IDLE | typeof DataChannelEvents.CONNECTED | typeof DataChannelEvents.UNAVAILABLE;

type OnIdleListener = (id: Id) => void;

type OnConnectedListener = (id: Id) => void;

type OnUnavailableListener = (id: Id) => void;

type DataChanelListeners = OnIdleListener | OnConnectedListener | OnUnavailableListener;

/**
 * Data channel
 * @link https://github.com/DjonnyX/data-channel-router/blob/main/library/src/components/DataChannel.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
@final
export class DataChannel extends EventEmitter<ChannelEvents, DataChanelListeners> {
    constructor(private _options: IDataChannelOptions) {
        super();
    }

    dispose() {

    }
}