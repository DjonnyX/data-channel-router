import { DataChannelRouter, DataChannelRouterEvents, DataChannelSignalQuality, IDataChannel, IDataChannelOptions } from 'data-channel-router';

class Request {
    private _pingTimeout: number;
    private _getTimeout: number;
    private _postTimeout: number;
    private _putTimeout: number;
    private _deleteTimeout: number;

    ping(opId: string) {
        clearTimeout(this._pingTimeout);
        return new Promise<{ opId: string }>((res, rej) => {
            const timeout = Math.random() * 500;
            this._pingTimeout = setTimeout(() => {
                const isError = Math.round(Math.random()) === 1;
                if (isError) {
                    res({ opId });
                } else {
                    rej(new Error('Some error'));
                }
            }, timeout) as unknown as number;
        });
    }
    get(route: string) {
        clearTimeout(this._getTimeout);
        return new Promise<{ route: string }>((res, rej) => {
            const timeout = Math.random() * 500;
            this._getTimeout = setTimeout(() => {
                const isError = Math.round(Math.random()) === 1;
                if (isError) {
                    res({ route });
                } else {
                    rej(new Error('Some error'));
                }
            }, timeout) as unknown as number;
        });
    }
    post<D = any>(route: string, data: D) {
        clearTimeout(this._postTimeout);
        return new Promise<{ route: string }>((res, rej) => {
            const timeout = Math.random() * 500;
            this._postTimeout = setTimeout(() => {
                const isError = Math.round(Math.random()) === 1;
                if (isError) {
                    res({ route });
                } else {
                    rej(new Error('Some error'));
                }
            }, timeout) as unknown as number;
        });
    }
    put<D = any>(route: string, data: D) {
        clearTimeout(this._putTimeout);
        return new Promise<{ route: string }>((res, rej) => {
            const timeout = Math.random() * 500;
            this._putTimeout = setTimeout(() => {
                const isError = Math.round(Math.random()) === 1;
                if (isError) {
                    res({ route });
                } else {
                    rej(new Error('Some error'));
                }
            }, timeout) as unknown as number;
        });
    }
    delete(route: string) {
        clearTimeout(this._deleteTimeout);
        return new Promise<{ route: string }>((res, rej) => {
            const timeout = Math.random() * 500;
            this._deleteTimeout = setTimeout(() => {
                const isError = Math.round(Math.random()) === 1;
                if (isError) {
                    res({ route });
                } else {
                    rej(new Error('Some error'));
                }
            }, timeout) as unknown as number;
        });
    }
}

interface IRoutes {
    getUser: (userId: string) => Promise<any>;
    createUser: (userId: string, data: { name: string; }) => Promise<any>;
    updateUser: (userId: string, data: { name: string; }) => Promise<any>;
    deleteUser: (userId: string) => Promise<any>;
}

const routes = (channel: string, req: Request): IRoutes => ({
    getUser: async (userId: string) => {
        const route = `${channel}/user/${userId}`, startTime = Date.now();
        try {
            console.info(`[PENDING]`, `Request: GET ${route}`);
            await req.get(`${channel}/user/${userId}`);
            const finishedTime = Date.now(), delay = finishedTime - startTime;
            console.info(`[SUCCESS]`, `Request: GET ${route} (${delay}ms)`);
        } catch (err) {
            const finishedTime = Date.now(), delay = finishedTime - startTime;
            console.info(`[ERROR]`, `Request: GET ${route} (${delay}ms)`);
        }
    },
    createUser: async (userId: string, data: { name: string; }) => {
        const route = `${channel}/user/${userId}`, startTime = Date.now();
        try {
            console.info(`[PENDING]`, `Request: POST ${route}`);
            await req.post(route, data);
            const finishedTime = Date.now(), delay = finishedTime - startTime;
            console.info(`[SUCCESS]`, `Request: POST ${route} (${delay}ms)`);
        } catch (err) {
            const finishedTime = Date.now(), delay = finishedTime - startTime;
            console.info(`[ERROR]`, `Request: POST ${route} (${delay}ms)`);
        }
    },
    updateUser: async (userId: string, data: { name: string; }) => {
        const route = `${channel}/user/${userId}`, startTime = Date.now();
        try {
            console.info(`[PENDING]`, `Request: PUT ${route}`);
            await req.put(route, data);
            const finishedTime = Date.now(), delay = finishedTime - startTime;
            console.info(`[SUCCESS]`, `Request: PUT ${route} (${delay}ms)`);
        } catch (err) {
            const finishedTime = Date.now(), delay = finishedTime - startTime;
            console.info(`[ERROR]`, `Request: PUT ${route} (${delay}ms)`);
        }
    },
    deleteUser: async (userId: string) => {
        const route = `${channel}/user/${userId}`, startTime = Date.now();
        try {
            console.info(`[PENDING]`, `Request: DELETE ${route}`);
            await req.delete(route);
            const finishedTime = Date.now(), delay = finishedTime - startTime;
            console.info(`[SUCCESS]`, `Request: DELETE ${route} (${delay}ms)`);
        } catch (err) {
            const finishedTime = Date.now(), delay = finishedTime - startTime;
            console.info(`[ERROR]`, `Request: DELETE ${route} (${delay}ms)`);
        }
    },
});

const req1 = new Request(), channel1: IDataChannelOptions<IRoutes> = {
    ping: () => {
        return req1.ping('[channel1]::[PING]');
    },
    routes: routes('channel1', req1),
};
const req2 = new Request(), channel2: IDataChannelOptions<IRoutes> = {
    ping: () => {
        return req2.ping('[channel2]::[PING]');
    },
    routes: routes('channel2', req2),
};
const req3 = new Request(), channel3: IDataChannelOptions<IRoutes> = {
    ping: () => {
        return req3.ping('[channel3]::[PING]');
    },
    routes: routes('channel3', req3),
};
const req4 = new Request(), channel4: IDataChannelOptions<IRoutes> = {
    ping: () => {
        return req4.ping('[channel4]::[PING]');
    },
    routes: routes('channel4', req4),
};

const channels: Array<IDataChannelOptions> = [
    channel1, channel2, channel3,
];

const dc = new DataChannelRouter<IRoutes>({
    maxThreads: 2,
    channels,
    delayMap: {
        [DataChannelSignalQuality.VERY_HIGH]: 50,
        [DataChannelSignalQuality.HIGH]: 100,
        [DataChannelSignalQuality.MIDDLE]: 500,
        [DataChannelSignalQuality.LOW]: 1000,
        [DataChannelSignalQuality.VERY_LOW]: 2000,
    },
});

dc.addEventListener(DataChannelRouterEvents.CHANNEL_CHANGE, (channel: IDataChannel | null) => {
    if (channel) {
        const channelNumber = Number(channel.id) + 1;
        console.info(`[CONNECT] Active channel: channel${channelNumber}, status: ${channel.status}`);
    } else {
        console.error('[ERROR] No communication channels available.');
    }
    const stats = dc.stats, actualStats: { [id: string]: any } = {};
    for (const id in stats) {
        const num = Number(id) + 1, stat = stats[id];
        actualStats[`channel${num}`] = stat;
    }
    console.info(`[STATS] Stats by channels`, JSON.stringify(actualStats));
})

setInterval(() => {
    if (!dc.router) {
        console.error('[ERROR] No communication channels available.');
        return;
    }
    const routeNum = Math.round(Math.random() * 4),
        userId = `${100 + Math.round(Math.random() * 10000)}`;
    switch (routeNum) {
        default:
        case 0: {
            dc.router.getUser(userId);
            break;
        }
        case 1: {
            dc.router.createUser(userId, { name: 'DC' });
            break;
        }
        case 2: {
            dc.router.updateUser(userId, { name: 'JOKER' });
            break;
        }
        case 3: {
            dc.router.deleteUser(userId);
            break;
        }
    }
}, 2000);

setTimeout(() => {
    dc.add(channel4);
}, 5000);
