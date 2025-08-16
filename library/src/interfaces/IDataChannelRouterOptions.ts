import { IDataChannel } from "./IDataChannel";

/**
 * DataChannelRouter options interface
 * @link https://github.com/DjonnyX/data-channel-router/blob/main/src/interfaces/IDataChannelRouterOptions.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export interface IDataChannelRouterOptions {
    channels: Array<IDataChannel>,
}