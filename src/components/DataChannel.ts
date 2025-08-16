import { DataChannelEvents } from "../enums";
import { IDataChannelOptions } from "../interfaces/IDataChannelOptions";
import { Id } from "../types";
import { EventEmitter, final } from "../utils";

type CacheMapEvents = typeof DataChannelEvents.IDLE | typeof DataChannelEvents.CONNECTED | typeof DataChannelEvents.UNAVAILABLE;

type OnDataChannelIdleListener = (id: Id) => void;

type OnDataChannelConnectedListener = (id: Id) => void;

type OnDataChannelUnavailableListener = (id: Id) => void;

type DataChanelListeners = OnDataChannelIdleListener | OnDataChannelConnectedListener | OnDataChannelUnavailableListener;

/**
 * Data channel
 * @link https://github.com/DjonnyX/data-channel-router/blob/main/src/components/DataChannel.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
@final
export class DataChannel extends EventEmitter<CacheMapEvents, DataChanelListeners> {
    constructor(private _options: IDataChannelOptions) {
        super();
    }

    dispose() {

    }
}