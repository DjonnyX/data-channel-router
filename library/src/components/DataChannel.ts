import { DataChannelEvents } from "../enums";
import { IDataChannel, IDataChannelOptions } from "../interfaces";
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

    get status() { return this._channel.status; }

    get options() { return this._options; }

    get router() { return this._channel.router; }

    protected _channel: DataChannelExecutor;

    private _onDataChannelConnectedHandler() {
        this.dispatch(DataChannelEvents.CONNECTED, this);
    }

    private _onDataChannelIdleHandler() {
        this.dispatch(DataChannelEvents.IDLE, this);
    }

    private _onDataChannelUnavailableHandler() {
        this.dispatch(DataChannelEvents.UNAVAILABLE, this);
    }

    constructor(private _options: IDataChannelOptions) {
        super();

        this._channel = new DataChannelExecutor(_options);
        this._channel.addEventListener(DataChannelEvents.CONNECTED, this._onDataChannelConnectedHandler);
        this._channel.addEventListener(DataChannelEvents.IDLE, this._onDataChannelIdleHandler);
        this._channel.addEventListener(DataChannelEvents.UNAVAILABLE, this._onDataChannelUnavailableHandler);
    }

    dispose() {
        super.dispose();

        if (this._channel) {
            this._channel.dispose();
        }
    }
}