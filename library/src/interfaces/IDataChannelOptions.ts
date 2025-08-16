import { IDataChannel } from "./IDataChannel";

/**
 * DataChannel options interface
 * @link https://github.com/DjonnyX/data-channel-router/blob/main/library/src/interfaces/IDataChannelOptions.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IDataChannelOptions<R = any> {
    /**
     * Routes
     */
    routes: R;
    /**
     * Ping handler
     */
    ping: (...args: any[]) => Promise<any>;
}