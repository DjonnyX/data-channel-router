import { DataChannel, DataChannelRouter, IDataChannel } from '../library/src';

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
                const opSuccess = Boolean(Math.round(Math.random()));
                if (opSuccess) {
                    res({ opId });
                    return;
                }
                rej();
            }, timeout) as unknown as number;
        });
    }
    get(route: string) {
        clearTimeout(this._getTimeout);
        return new Promise<{ route: string }>((res) => {
            const timeout = Math.random() * 500;
            this._getTimeout = setTimeout(() => {
                res({ route });
            }, timeout) as unknown as number;
        });
    }
    post<D = any>(route: string, data: D) {
        clearTimeout(this._postTimeout);
        return new Promise<{ route: string }>((res) => {
            const timeout = Math.random() * 500;
            this._postTimeout = setTimeout(() => {
                res({ route });
            }, timeout) as unknown as number;
        });
    }
    put<D = any>(route: string, data: D) {
        clearTimeout(this._putTimeout);
        return new Promise<{ route: string }>((res) => {
            const timeout = Math.random() * 500;
            this._putTimeout = setTimeout(() => {
                res({ route });
            }, timeout) as unknown as number;
        });
    }
    delete(route: string) {
        clearTimeout(this._deleteTimeout);
        return new Promise<{ route: string }>((res) => {
            const timeout = Math.random() * 500;
            this._deleteTimeout = setTimeout(() => {
                res({ route });
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
        const route = `${channel}/user/${userId}`;
        try {
            console.info(`[PENDING]`, `Request: GET ${route}`);
            req.get(`${channel}/user/${userId}`);
            console.info(`[SUCCESS]`, `Request: GET ${route}`);
        } catch (err) {
            console.info(`[ERROR]`, `Request: GET ${route}`);
        }
    },
    createUser: async (userId: string, data: { name: string; }) => {
        const route = `${channel}/user/${userId}`;
        try {
            console.info(`[PENDING]`, `Request: POST ${route}`);
            req.post(route, data);
            console.info(`[SUCCESS]`, `Request: POST ${route}`);
        } catch (err) {
            console.info(`[ERROR]`, `Request: POST ${route}`);
        }
    },
    updateUser: async (userId: string, data: { name: string; }) => {
        const route = `${channel}/user/${userId}`;
        try {
            console.info(`[PENDING]`, `Request: PUT ${route}`);
            req.put(route, data);
            console.info(`[SUCCESS]`, `Request: PUT ${route}`);
        } catch (err) {
            console.info(`[ERROR]`, `Request: PUT ${route}`);
        }
    },
    deleteUser: async (userId: string) => {
        const route = `${channel}/user/${userId}`;
        try {
            console.info(`[PENDING]`, `Request: DELETE ${route}`);
            req.delete(route);
            console.info(`[SUCCESS]`, `Request: DELETE ${route}`);
        } catch (err) {
            console.info(`[ERROR]`, `Request: DELETE ${route}`);
        }
    },
});

const req1 = new Request(), channel1 = new DataChannel({
    ping: () => {
        return req1.ping('[channel1]::[PING]');
    },
    routes: routes('channel1', req1),
});
const req2 = new Request(), channel2 = new DataChannel({
    ping: () => {
        return req2.ping('[channel2]::[PING]');
    },
    routes: routes('channel2', req2),
});
const req3 = new Request(), channel3 = new DataChannel({
    ping: () => {
        return req3.ping('[channel3]::[PING]');
    },
    routes: routes('channel3', req3),
});

const channels: Array<IDataChannel> = [
    channel1, channel2, channel3,
];

const dc = new DataChannelRouter<IRoutes>({
    channels,
});

setInterval(() => {
    const routeNum = Math.round(Math.random() * 4);
    switch (routeNum) {
        default:
        case 0: {
            const userId = `${100 + Math.random() * 10000}`;
            dc.router.getUser(userId);
            break;
        }
        case 1: {
            const userId = `${100 + Math.random() * 10000}`;
            dc.router.createUser(userId, { name: 'DC' });
            break;
        }
        case 2: {
            const userId = `${100 + Math.random() * 10000}`;
            dc.router.updateUser(userId, { name: 'DC1' });
            break;
        }
        case 3: {
            const userId = `${100 + Math.random() * 10000}`;
            dc.router.deleteUser(userId);
            break;
        }
    }
}, 2000);
