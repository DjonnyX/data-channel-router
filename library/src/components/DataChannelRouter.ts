import { DATA_CHANNEL_SIGNAL_QUALITY_LIST, DEFAULT_PING_TIMEOUT } from "../const";
import { DataChannelSignalQuality, DataChannelStatuses } from "../enums";
import { DataChannelRouterEvents } from "../enums/DataChannelRouterEvents";
import { ThreadManagerEvents } from "../enums/ThreadManagerEvents";
import { IDataChannel, IDataChannelOptions, IDataChannelRouterOptions, IDelayMap } from "../interfaces";
import { Id } from "../types";
import { calculateSignalQuality, EventEmitter, final } from "../utils";
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
export class DataChannelRouter<R = any> extends EventEmitter<Events, Listeners> {
    private _channelsByPriority = new Map<DataChannelSignalQuality, Array<DataChannelProxy>>();

    private _threadManager: ThreadManager;

    get router() { return this._activeChannel?.router as R ?? null; }

    get stats() {
        const map = this._channelsByPriority, result: { [id: Id]: { status: DataChannelStatuses, signal: DataChannelSignalQuality } } = {};
        for (let i = 0, l = DATA_CHANNEL_SIGNAL_QUALITY_LIST.length; i < l; i++) {
            const signal: DataChannelSignalQuality = DATA_CHANNEL_SIGNAL_QUALITY_LIST[i];
            if (map.has(signal)) {
                const channels = map.get(signal);
                if (channels.length > 0) {
                    for (let channel of channels) {
                        result[channel.id] = { signal, status: channel.status };
                    }
                }
            }
        }
        return result;
    }

    private _pingTimeout: number;

    private _pingTimeouts: { [channelId: Id]: number } = {};

    private _activeChannel: DataChannelProxy | null;
    get activeChannel() { return this._activeChannel; }

    private _delayMap: IDelayMap;

    constructor(options: IDataChannelRouterOptions<R>) {
        super();

        this._pingTimeout = options.pingTimeout ?? DEFAULT_PING_TIMEOUT;

        this._delayMap = options.delayMap;

        this._threadManager = new ThreadManager({
            maxThreads: options?.maxThreads,
        });

        if (options?.channels) {
            this.createInitialChannels(options.channels);
        }

        this.run();
    }

    private createInitialChannels(channels: Array<IDataChannelOptions>) {
        for (let i = 0, l = channels.length; i < l; i++) {
            const externalChannel = channels[i];
            if (externalChannel) {
                const channel = new DataChannelProxy(externalChannel, this._threadManager);

                this.addChannelToMap(channel);

                this.pingChannel(channel, true);
            }
        }
    }

    private run() {
        this._threadManager.run();
    }

    /**
     * Adds a new data channel
     */
    add(channel: IDataChannelOptions) {
        const externalChannel = channel;
        if (externalChannel) {
            const channel = new DataChannelProxy(externalChannel, this._threadManager);

            this.addChannelToMap(channel);

            this.pingChannel(channel, true);
        }
    }

    private addChannelToMap(channel: DataChannelProxy) {
        const map = this._channelsByPriority;
        if (!map.has(DataChannelSignalQuality.DISABLED)) {
            map.set(DataChannelSignalQuality.DISABLED, []);
        }
        map.get(DataChannelSignalQuality.DISABLED).push(channel);
    }

    private pingChannel(channel: DataChannelProxy, init = false) {
        clearTimeout(this._pingTimeouts[channel.id]);
        if (init) {
            this.ping(channel);
        }
        this._pingTimeouts[channel.id] = setTimeout(() => {
            this.ping(channel);
        }, this._pingTimeout) as unknown as number;
    }

    private ping(channel: DataChannelProxy) {
        const thread = new Thread({
            onStart: () => {
                channel.channel.ping(channel.options.ping, (err: any | null, delay: number | null) => {
                    let signalQuality: DataChannelSignalQuality = DataChannelSignalQuality.DISABLED;
                    if (err) {
                        thread.reject();

                        signalQuality = calculateSignalQuality(-1);
                        const isChanged = this.storeChannel(channel, signalQuality);
                        this.selectFastestChannel();
                        if (isChanged) {
                            this.dispatch(DataChannelRouterEvents.CHANGE, channel.id, channel.status);
                        }

                        this.pingChannel(channel);
                        return;
                    }

                    signalQuality = calculateSignalQuality(delay, this._delayMap);
                    const isChanged = this.storeChannel(channel, signalQuality);
                    this.selectFastestChannel();
                    if (isChanged) {
                        this.dispatch(DataChannelRouterEvents.CHANGE, channel.id, channel.status);
                    }

                    thread.complete();

                    this.pingChannel(channel);
                });
            }
        });

        this._threadManager.add(thread);
    }

    private storeChannel(channel: DataChannelProxy, signalQuality: DataChannelSignalQuality): boolean {
        const map = this._channelsByPriority,
            status = signalQuality === DataChannelSignalQuality.DISABLED ? DataChannelStatuses.UNAVAILABLE : DataChannelStatuses.IDLE;

        if (!map.has(signalQuality)) {
            map.set(signalQuality, []);
        }

        if (channel.channel.signal !== signalQuality) {
            map.forEach((data) => {
                const index = data.findIndex(c => c.channel.id === channel.channel.id);
                if (index > -1) {
                    data.splice(index, 1);
                }
            });

            const list = map.get(signalQuality);
            channel.channel.status = status;
            channel.channel.signal = signalQuality;
            list.push(channel);
            return true;
        }
        return false;
    }

    private selectFastestChannel(attempt = 5) {
        const map = this._channelsByPriority;
        let channel: DataChannelProxy | null = null, maxSignal = 0;
        for (let i = 0, l = DATA_CHANNEL_SIGNAL_QUALITY_LIST.length; i < l; i++) {
            const signal: DataChannelSignalQuality = DATA_CHANNEL_SIGNAL_QUALITY_LIST[i];
            if (signal === DataChannelSignalQuality.DISABLED) {
                continue;
            }
            if (map.has(signal)) {
                const channels = map.get(signal);
                if (channels.length > 0) {
                    for (let i = 0, l = channels.length; i < l; i++) {
                        const c = channels[0];
                        if (c.status !== DataChannelStatuses.UNAVAILABLE) {
                            if (c.signal > maxSignal) {
                                maxSignal = Math.max(maxSignal, c.signal);
                                channel = c;
                            }
                        }
                    }
                }
            }
        }

        if (this._activeChannel !== channel) {
            if (this._activeChannel) {
                const signalQuality = this._activeChannel.channel.signal,
                    status = signalQuality === DataChannelSignalQuality.DISABLED ? DataChannelStatuses.UNAVAILABLE : DataChannelStatuses.IDLE;
                this._activeChannel.channel.status = status;
                if (!channel && this._activeChannel.status === DataChannelStatuses.UNAVAILABLE) {
                    if (attempt > 0) {
                        this.selectFastestChannel(attempt - 1);
                    }
                }
            }
            if (channel) {
                channel.channel.status = DataChannelStatuses.CONNECTED;
                this._activeChannel = channel;
                this.dispatch(DataChannelRouterEvents.CHANNEL_CHANGE, { id: channel.id, status: channel.status });
            } else {
                this._activeChannel = null;
                this.dispatch(DataChannelRouterEvents.CHANNEL_CHANGE, null);
            }
        }
    }

    dispose() {
        super.dispose();

        if (this._threadManager) {
            this._threadManager.dispose();
        }

        for (const channelId in this._pingTimeouts) {
            const pingTimeoutId = this._pingTimeouts[channelId];
            clearTimeout(pingTimeoutId);
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