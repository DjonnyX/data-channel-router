import { IDataChannel } from "./IDataChannel";

/**
 * DataChannelRouter options interface
 * @link https://github.com/DjonnyX/data-channel-router/blob/main/library/src/interfaces/IDataChannelRouterOptions.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IDataChannelRouterOptions<R = any> {
    /**
     * Data channels
     */
    channels: Array<IDataChannel>;
    /**
     * Maximum number of parallel threads
     */
    maxThreads?: number;
    /**
     * The timeout between pings
     */
    pingTimeout?: number;
}