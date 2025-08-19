# data-channel-router

A modern library designed for robust communication in scenarios where multiple data channels are available (e.g., different service endpoints, fallback paths, etc.). It automatically manages failover, monitors health, enables customizable concurrency, and offers event-based hooks to keep your application responsive and resilient.

<img width="1033" height="171" alt="logo-center" src="https://github.com/user-attachments/assets/f889b82c-bfcf-45a9-8926-b3250aae6eb8" />

[Live demo](https://data-channel-router.eugene-grebennikov.pro/)

![Preview](https://github.com/user-attachments/assets/0751f46d-5416-41d1-a847-e99f00ff3666)

| Feature                                | Description                                                                                            |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **Automatic Failover**                 | Switches between multiple defined channels upon failure                                                |
| **Ping Mechanism**                     | Uses `ping` functions for health checking and determines signal quality using a configurable delay map |
| **Concurrency Controls**               | Configure how many ping or route requests run in parallel (`maxThreads`, `maxPingThreads`)             |
| **Event-Driven**                       | Emits events for stats updates, failures, recoveries, buffering, and channel changes                   |
| **Stat Tracking & Availability Check** | Exposes properties like `.stats`, `.isAvailable`, and a `.router` object to dispatch route calls       |
| **No Dependencies**                    | Lightweight setup, completely self-contained                                              |

## Installation

Run
```bash
npm i data-channel-router
```
Pretty straightforward — no dependencies

## Basic Usage Example

```ts
// Channel route description interface
interface IRoutes {
    getUser: (userId: string) => Promise<any>;
}

const routes = (channelService: string): IRoutes => ({
    getUser: async (userId: string) => {
        const route = `${channelService}/user/${userId}`;
        try {
            await fetch(`${channelService}/user/${userId}`);
        } catch (err) {
            // Do something
        }
    },
    // etc
});

const channel1: IDataChannelOptions<IRoutes> = {
    id: 1,
    ping: () => {
        return fetch('channel1/ping');
    },
    routes: routes('service1.my-web-application.com'),
};
const channel2: IDataChannelOptions<IRoutes> = {
    id: 2,
    ping: () => {
        return fetch('channel2/ping');
    },
    routes: routes('service2.my-web-application.com'),
};

// Channel list
const channels: Array<IDataChannelOptions> = [
    channel1, channel2,
];

const dc = new DataChannelRouter<IRoutes>({
    channels,
    // Set up ping delay matching to determine connection quality
    delayMap: {
        [DataChannelSignalQuality.VERY_HIGH]: 50,
        [DataChannelSignalQuality.HIGH]: 100,
        [DataChannelSignalQuality.MIDDLE]: 500,
        [DataChannelSignalQuality.LOW]: 1000,
        [DataChannelSignalQuality.VERY_LOW]: 2000,
    },
    // Sets the number of parallel route requests
    maxThreads: 6,
    // Sets the number of parallel ping requests
    maxPingThreads: 4,
    // Sets the timeout between pings
    pingTimeout: 2000,
});

// Listening to changes in statistics
dc.addEventListener(DataChannelRouterEvents.STATS, (stats: IDataChannelsStats) => {
    let statStr = '';
    for (const idStr in stats) {
        const id = Number(idStr), stat = stats[id];
        statStr += `channel${id}: status: ${stat.status}; signal: ${stat.signal} <br/>`;
    }
    console.info(statStr);
});
// Listen for buffering changes
dc.addEventListener(DataChannelRouterEvents.BUFFERING, (bufferSize: number) => {
    console.info(`Buffering: ${bufferSize}`);
});
// Listening for ping failure event
dc.addEventListener(DataChannelRouterEvents.PING_FAILURE, (channelId: Id) => {
    console.info(`Ping failure on channel${channelId}`);
});
// Listen for route failure event
dc.addEventListener(DataChannelRouterEvents.ROUTE_ERROR, (routeName: string, channelId: Id) => {
    log(`Route error ${routeName} on channel${channelId}`);
});
// Listen for channel failure recovery event
dc.addEventListener(DataChannelRouterEvents.CHANNEL_RECOVERY, (channel: IDataChannelInfo) => {
    log(`The channel${channel.id} has been recovered`);
});
// Start the channel change listener
dc.addEventListener(DataChannelRouterEvents.CHANNEL_CHANGE, (channel: IDataChannelInfo | null) => {
    if (channel) {
        // Do something
        // It is possible to implement a subscription to listen to sockets on a given channel and close sockets of an inactive channel.
        // See the example of implementation at https://github.com/DjonnyX/data-channel-router/blob/main/src/index.ts
    } else {
        throw Error('No data channels available.');
    }
});

// Next, each time we call a route, we first check the availability of the router.
if (!dc.isAvailable) {
    throw Error('No data channels available.');
} else {
    dc.router.getUser('666');
}
```

## API

[DataChannelRouter](https://github.com/DjonnyX/data-channel-router/blob/main/library/src/components/DataChannelRouter.ts)

Methods

| Method | Arguments | Description |
|---|---|---|
| constructor | options: [IDataChannelRouterOptions<R>](https://github.com/DjonnyX/data-channel-router/blob/main/library/src/interfaces/IDataChannelRouterOptions.ts) | Class constructor. | 
| add | channel: [IDataChannelOptions](https://github.com/DjonnyX/data-channel-router/blob/main/library/src/interfaces/IDataChannelOptions.ts) | Adds a new data channel. | 
| dispose |  | Clears all data. Called before deletion. |

<br/>

Properties

| Property | Type | Description |
|---|---|---|
| buffering | number | Readonly. Returns the buffering value |
| isAvailable | boolean | Readonly. Returns true if there are data channels available. |
| router | R | Generic type. Router. |
| stats | [IDataChannelsStats](https://github.com/DjonnyX/data-channel-router/blob/main/library/src/interfaces/IDataChannelsStats.ts) | Readonly. Returns statistics for data channels. |

<br/>

Events

| Name | Type | Description |
|---|---|---|
| DataChannelRouterEvents.CHANNEL_CHANGE | (channel: [IDataChannelInfo](https://github.com/DjonnyX/data-channel-router/blob/main/library/src/interfaces/IDataChannelInfo.ts)) => void | Emitted when the data transmission channel changes. |
| DataChannelRouterEvents.CHANNEL_UNAVAILABLE | (channel: [IDataChannelInfo](https://github.com/DjonnyX/data-channel-router/blob/main/library/src/interfaces/IDataChannelInfo.ts)) => void => void | Emitted when the data channel becomes unavailable. |
| DataChannelRouterEvents.CHANNEL_RECOVERY | (channel: [IDataChannelInfo](https://github.com/DjonnyX/data-channel-router/blob/main/library/src/interfaces/IDataChannelInfo.ts)) => void => void | Emitted when a previously faulty channel becomes operational again. |
| DataChannelRouterEvents.CHANGE | (channel: [IDataChannelInfo](https://github.com/DjonnyX/data-channel-router/blob/main/library/src/interfaces/IDataChannelInfo.ts) \| null) => void => void | Emit when changing the statuses of the channels. |
| DataChannelRouterEvents.PING_FAILURE | (channelId: [Id](https://github.com/DjonnyX/data-channel-router/blob/main/library/src/types/id.ts)) => void => void | Emitted during ping failure. |
| DataChannelRouterEvents.ROUTE_ERROR | (routeName: string, channelId: Id) => void | Emitted when a route call fails. |
| DataChannelRouterEvents.STATS | (stats: [IDataChannelsStats](https://github.com/DjonnyX/data-channel-router/blob/main/library/src/interfaces/IDataChannelsStats.ts)) => void | Emitted when the signal and status in data channels changes. |
| DataChannelRouterEvents.BUFFERING | (bufferSize: number) => void | Emitted when the buffer size changes. |

<br/>

## License

MIT License

Copyright (c) 2025 djonnyx (Evgenii Grebennikov)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
