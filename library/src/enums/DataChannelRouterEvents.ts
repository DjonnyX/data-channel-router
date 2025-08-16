/**
 * Data channel router events
 * @link https://github.com/DjonnyX/data-channel-router/blob/main/library/src/enums/DataChannelRouterEvents.ts
 * @author Evgenii Grebennikov
 * @email djonnyx@gmail.com
 */
export enum DataChannelRouterEvents {
    /**
     * Emitted when the data transmission channel changes.
     */
    CHANNEL_CHANGE = 'channel-change',
    /**
     * Emit when changing the statuses of the channels.
     */
    CHANGE = 'change',
}