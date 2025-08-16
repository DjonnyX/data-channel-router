import { DataChannelEvents, DataChannelStatuses } from "../enums";
import { IDataChannel, IDataChannelOptions } from "../interfaces";
import { Id } from "../types";
import { EventEmitter, final } from "../utils";
import { createRouter } from "../utils/createRouter";

type ChannelEvents = typeof DataChannelEvents.IDLE | typeof DataChannelEvents.CONNECTED | typeof DataChannelEvents.UNAVAILABLE;

type OnIdleListener = (channel: IDataChannel) => void;

type OnConnectedListener = (channel: IDataChannel) => void;

type OnUnavailableListener = (channel: IDataChannel) => void;

type DataChanelListeners = OnIdleListener | OnConnectedListener | OnUnavailableListener;

/**
 * Data channel target
 * @link https://github.com/DjonnyX/data-channel-router/blob/main/library/src/components/DataChannelExecutor.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
@final
export class DataChannelExecutor<R = any> extends EventEmitter<ChannelEvents, DataChanelListeners> {
    private static __nextId: number = 0;

    private _id: Id;
    get id() { return this._id; }

    private _status: DataChannelStatuses;
    get status() { return this._status; }
    set status(v: DataChannelStatuses) {
        if (this._status !== v) {
            this._status = v;
            this.dispatchStatus(v);
        }
    }

    private _router: R;
    get router() { return this._router; }

    constructor(private _options: IDataChannelOptions) {
        super();
        this._router = createRouter<R>(this._options.routes);
        this._id = DataChannelExecutor.__nextId;
        DataChannelExecutor.__nextId = DataChannelExecutor.__nextId === Number.MAX_SAFE_INTEGER ? 0 : DataChannelExecutor.__nextId + 1;
    }

    protected dispatchStatus(status: DataChannelStatuses) {
        switch (status) {
            case DataChannelStatuses.CONNECTED: {
                this.dispatch(DataChannelEvents.CONNECTED, this);
                break;
            }
            case DataChannelStatuses.IDLE: {
                this.dispatch(DataChannelEvents.IDLE, this);
                break;
            }
            case DataChannelStatuses.UNAVAILABLE: {
                this.dispatch(DataChannelEvents.UNAVAILABLE, this);
                break;
            }
        }
    }

    async ping(executor: () => Promise<any>, cb?: (error: any | null, delay: number | null) => void) {
        const startTime = Date.now();
        try {
            await executor();
            if (cb !== undefined) {
                const time = Date.now(), delay = time - startTime;
                cb(null, delay);
            }
        } catch (error) {
            if (cb !== undefined) {
                cb(error, null);
            }
        }
    }

    dispose() {

    }
}