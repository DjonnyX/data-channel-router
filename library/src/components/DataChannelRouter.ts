import { DataChannelSignalQuality } from "../enums";
import { IDataChannelRouterOptions } from "../interfaces";
import { EventEmitter, final } from "../utils";
import { DataChannel } from "./DataChannel";

/**
 * Data channel router
 * @link https://github.com/DjonnyX/data-channel-router/blob/main/library/src/components/DataChannelRouter.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
@final
export class DataChannelRouter extends EventEmitter {
    private _channelsByPriority = new Map<DataChannelSignalQuality, Array<DataChannel>>();

    constructor(private _options: IDataChannelRouterOptions) {
        super();
    }

    dispose() {

    }
}