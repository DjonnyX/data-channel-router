import { IDataChannelOptions } from "../interfaces";
import { DataChannel } from "./DataChannel";
import { ThreadManager } from "./ThreadManager";

/**
 * Data channel
 * @link https://github.com/DjonnyX/data-channel-router/blob/main/library/src/components/DataChannelProxy.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export class DataChannelProxy extends DataChannel {
    get channel() {
        return this._channel;
    }

    get externalChannel() {
        return this._externalChannel;
    }

    constructor(private _externalChannel: IDataChannelOptions, threadManager: ThreadManager) {
        super(_externalChannel, threadManager);
    }
}