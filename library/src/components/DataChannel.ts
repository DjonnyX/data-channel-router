import { DataChannelEvents } from "../enums";
import { IDataChannel, IDataChannelOptions } from "../interfaces";
import { Id } from "../types";
import { EventEmitter } from "../utils";
import { DataChannelExecutor } from "./DataChannelExecutor";

type ChannelEvents = typeof DataChannelEvents.IDLE | typeof DataChannelEvents.CONNECTED | typeof DataChannelEvents.UNAVAILABLE;

type OnIdleListener = (channel: IDataChannel) => void;

type OnConnectedListener = (channel: IDataChannel) => void;

type OnUnavailableListener = (channel: IDataChannel) => void;

type DataChanelListeners = OnIdleListener | OnConnectedListener | OnUnavailableListener;

/**
 * Data channel
 * @link https://github.com/DjonnyX/data-channel-router/blob/main/library/src/components/DataChannel.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export class DataChannel extends EventEmitter<ChannelEvents, DataChanelListeners> {
    get id() { return this._channel.id; }

    get status() {
        return this._channel.status;
    }

    get options() { return this._options; }

    get router() { return this._channel.router; }

    protected _channel: DataChannelExecutor;

    constructor(private _options: IDataChannelOptions, id?: Id) {
        super();

        this._channel = new DataChannelExecutor(_options, id);
    }

    dispose() {
        super.dispose();

        if (this._channel) {
            this._channel.dispose();
        }
    }
}