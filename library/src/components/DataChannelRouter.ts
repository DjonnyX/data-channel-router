import { DATA_CHANNEL_SIGNAL_QUALITY_LIST } from "../const";
import { DataChannelEvents, DataChannelSignalQuality, DataChannelStatuses } from "../enums";
import { DataChannelRouterEvents } from "../enums/DataChannelRouterEvents";
import { ThreadManagerEvents } from "../enums/ThreadManagerEvents";
import { IDataChannel, IDataChannelRouterOptions } from "../interfaces";
import { Id } from "../types";
import { calculateSignalQuality, EventEmitter, final } from "../utils";
import { DataChannel } from "./DataChannel";
import { DataChannelProxy } from "./DataChannelProxy";
import { Thread } from "./Thread";
import { ThreadManager } from "./ThreadManager";

type Events = typeof DataChannelRouterEvents.CHANNEL_CHANGE | typeof DataChannelRouterEvents.CHANGE;

type OnChannelChangeListener = (channel: IDataChannel) => void;

type OnChangeListener = (channelId: Id, status: DataChannelStatuses) => void;

type Listeners = OnChannelChangeListener | OnChangeListener;

/**
 * Data channel router
 * @link https://github.com/DjonnyX/data-channel-router/blob/main/library/src/components/DataChannelRouter.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
@final
export class DataChannelRouter extends EventEmitter<Events, Listeners> {
    private _channelsByPriority = new Map<DataChannelSignalQuality, Array<DataChannelProxy>>();

    private _threadManager: ThreadManager;

    private _activeChannel: DataChannelProxy | null;
    get activeChannel() { return this._activeChannel; }

    private _onStartThreadManagerHandler = () => {
        // etc
    };

    private _onCompleteThreadManagerHandler = () => {
        // etc
    };

    private _onChannelConnectedStatusHandler = (channel: IDataChannel) => {
        this.dispatch(DataChannelRouterEvents.CHANGE, channel.id, channel.status);
    };

    private _onChannelIdleStatusHandler = (channel: IDataChannel) => {
        this.dispatch(DataChannelRouterEvents.CHANGE, channel.id, channel.status);
    };

    private _onChannelUnavailableStatusHandler = (channel: IDataChannel) => {
        this.dispatch(DataChannelRouterEvents.CHANGE, channel.id, channel.status);
    };

    constructor(options?: IDataChannelRouterOptions) {
        super();

        this._threadManager = new ThreadManager({
            maxThreads: options?.maxThreads,
        });
        this._threadManager.addEventListener(ThreadManagerEvents.STARTED, this._onStartThreadManagerHandler);
        this._threadManager.addEventListener(ThreadManagerEvents.COMPLITED, this._onCompleteThreadManagerHandler);

        if (options?.channels) {
            this.createInitialChannels(options.channels);
        }

        this.run();
    }

    private createInitialChannels(channels: Array<IDataChannel>) {
        for (let i = 0, l = channels.length; i < l; i++) {
            const externalChannel = channels[i];
            if (externalChannel) {
                const channel = new DataChannelProxy(externalChannel as DataChannel);
                channel.channel.addEventListener(DataChannelEvents.CONNECTED, this._onChannelConnectedStatusHandler);
                channel.channel.addEventListener(DataChannelEvents.IDLE, this._onChannelIdleStatusHandler);
                channel.channel.addEventListener(DataChannelEvents.UNAVAILABLE, this._onChannelUnavailableStatusHandler);
                const thread = new Thread({
                    onStart: () => {
                        channel.channel.ping((err, delay) => {
                            let signalQuality: DataChannelSignalQuality = DataChannelSignalQuality.DISABLED;
                            if (err) {
                                thread.reject();

                                signalQuality = calculateSignalQuality(-1);
                                this.storeChannel(channel, signalQuality);
                                this.selectFastestChannel();
                                return;
                            }

                            signalQuality = calculateSignalQuality(delay);
                            this.storeChannel(channel, signalQuality);
                            this.selectFastestChannel();

                            thread.complete();
                        });
                    },
                });
                this._threadManager.add(thread);
            }
        }
    }

    private run() {
        this._threadManager.run();
    }

    private storeChannel(channel: DataChannelProxy, signalQuality: DataChannelSignalQuality) {
        const map = this._channelsByPriority;
        if (!map.has(signalQuality)) {
            map.set(signalQuality, []);
        }

        map.forEach((data) => {
            const index = data.findIndex(c => c === channel);
            if (index > -1) {
                data.splice(index, 1);
            }
        });

        const list = map.get(signalQuality);
        list.push(channel);
        channel.channel.status = signalQuality === DataChannelSignalQuality.DISABLED ? DataChannelStatuses.UNAVAILABLE : DataChannelStatuses.IDLE;
    }

    private selectFastestChannel() {
        const map = this._channelsByPriority;
        let channel: DataChannelProxy | null = null;
        for (let i = 0, l = DATA_CHANNEL_SIGNAL_QUALITY_LIST.length; i < l; i++) {
            const signal: DataChannelSignalQuality = DATA_CHANNEL_SIGNAL_QUALITY_LIST[i];
            if (signal === DataChannelSignalQuality.DISABLED) {
                channel = null;
                break;
            }
            if (map.has(signal)) {
                const channels = map.get(signal);
                if (channels.length > 0) {
                    channel = channels[0];
                    break;
                }
            }
        }
        if (this._activeChannel !== channel) {
            this._activeChannel = channel;
            channel.channel.status = DataChannelStatuses.CONNECTED;
            this.dispatch(DataChannelRouterEvents.CHANNEL_CHANGE, channel.externalChannel);
        }
    }

    dispose() {
        super.dispose();

        if (this._threadManager) {
            this._threadManager.dispose();
        }

        if (this._channelsByPriority) {
            this._channelsByPriority.forEach((channels) => {
                if (channels) {
                    for (let i = 0, l = channels.length; i < l; i++) {
                        channels[i].dispose();
                    }
                }
            });
            this._channelsByPriority.clear();
        }
    }
}