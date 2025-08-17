# data-channel-router

Communication channel router

<img width="1033" height="171" alt="logo-center" src="https://github.com/user-attachments/assets/f889b82c-bfcf-45a9-8926-b3250aae6eb8" />

## Installation

Run
```bash
npm i data-channel-router
```

## Example

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
    ping: () => {
        return fetch('channel1/ping');
    },
    routes: routes('service1.my-web-application.com'),
};
const channel2: IDataChannelOptions<IRoutes> = {
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
    // Set the number of parallel ping requests
    maxThreads: 2,
});

// Start the channel change listener
dc.addEventListener(DataChannelRouterEvents.CHANNEL_CHANGE, (channel: IDataChannel | null) => {
    if (channel) {
        // Do something
    } else {
        throw Error('No communication channels available.');
    }
});

// Next, each time we call a route, we first check the availability of the router.
// If the router is null, it means that there are no communication channels available at the moment.
if (!dc.router) {
    throw Error('No communication channels available.');
} else {
    dc.router.getUser('666');
}
```

## API

[DataChannelRouter](https://github.com/DjonnyX/data-channel-router/blob/main/library/src/components/DataChannelRouter.ts)

Methods

| Property | Type | Description |
|---|---|---|
| constructor | options: [IDataChannelRouterOptions<R>](https://github.com/DjonnyX/data-channel-router/blob/main/library/src/interfaces/IDataChannelRouterOptions.ts) | Class constructor. | 
| add | channel: [IDataChannelOptions](https://github.com/DjonnyX/data-channel-router/blob/main/library/src/interfaces/IDataChannelOptions.ts) | Adds a new data channel. | 

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
