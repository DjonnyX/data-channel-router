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
     * Emitted when the data channel becomes unavailable.
     */
    CHANNEL_UNAVAILABLE = 'channel-unavailable',
    /**
     * Emitted when a previously faulty channel becomes operational again.
     */
    CHANNEL_RECOVERY = 'channel-recovery',
    /**
     * Emit when changing the statuses of the channels.
     */
    CHANGE = 'change',
    /**
     * Emitted during ping failure.
     */
    PING_FAILURE = 'ping-failure',
    /**
     * Emitted when a route call fails.
     */
    ROUTE_ERROR = 'route-error',
    /**
     * Emitted when the signal and status in data channels changes.
     */
    STATS = 'ststs',
    /**
     * Emitted when the buffer size changes.
     */
    BUFFERING = 'buffering',
};