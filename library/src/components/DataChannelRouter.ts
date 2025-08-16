import { IDataChannelRouterOptions } from "../interfaces";
import { EventEmitter, final } from "../utils";

/**
 * Data channel router
 * @link https://github.com/DjonnyX/data-channel-router/blob/main/src/components/DataChannelRouter.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
@final
export class DataChannelRouter extends EventEmitter {
    constructor(private _options: IDataChannelRouterOptions) {
        super();
    }

    dispose() {

    }
}