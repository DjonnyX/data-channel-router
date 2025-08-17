import { DataChannelRouter, DataChannelRouterEvents, DataChannelSignalQuality, IDataChannel, IDataChannelOptions } from '../library/src';

let logStr: string = '';

const formatLogStr = (str: string) => {
    str = str.replace(/(channel1)/ig, `<span style="color:rgb(75, 190, 71);">$1</span>`);
    str = str.replace(/(channel2)/ig, `<span style="color:rgb(255, 97, 97);">$1</span>`);
    str = str.replace(/(channel3)/ig, `<span style="color:rgb(218, 40, 235);">$1</span>`);
    str = str.replace(/(channel4)/ig, `<span style="color:rgb(69, 156, 255);">$1</span>`);
    str = str.replace(/(\[CONNECT\])/ig, `<span style="color:rgb(118, 223, 86);">$1</span>`);
    str = str.replace(/(\[SUCCESS\])/ig, `<span style="color: #3c7936;">$1</span>`);
    str = str.replace(/(\[ERROR\])/ig, `<span style="color: #9f1717;">$1</span>`);
    str = str.replace(/(\[PENDING\])/ig, `<span style="color:rgb(23, 127, 159);">$1</span>`);
    return str;
}

const formatErrorStr = (str: string) => {
    return `<span style="color:rgb(255, 48, 48);">${str}</span>`;
}

const formatConnectStr = (str: string) => {
    return `<span style="color:rgb(118, 223, 86);">${str}</span>`;
}

const formatStatsStr = (str: string) => {
    let result = str;
    result = result.replace(/(\[channel1\])/ig, `<span style="color:rgb(75, 190, 71);">$1</span>`);
    result = result.replace(/(\[channel2\])/ig, `<span style="color:rgb(255, 97, 97);">$1</span>`);
    result = result.replace(/(\[channel3\])/ig, `<span style="color:rgb(218, 40, 235);">$1</span>`);
    result = result.replace(/(\[channel4\])/ig, `<span style="color:rgb(69, 156, 255);">$1</span>`);
    result = result.replace(/(connected)/ig, `<span style="color:rgb(118, 223, 86);">$1</span>`);
    result = result.replace(/(unavailable)/ig, `<span style="color:rgb(255, 88, 88);">$1</span>`);
    result = result.replace(/(idle)/ig, `<span style="color:rgb(221, 197, 59);">$1</span>`);
    result = result.replace(/(: 0)/ig, `<span style="color:rgb(221, 59, 59);">$1</span>`);
    result = result.replace(/(: 1)/ig, `<span style="color:rgb(238, 103, 41);">$1</span>`);
    result = result.replace(/(: 2)/ig, `<span style="color:rgb(235, 138, 58);">$1</span>`);
    result = result.replace(/(: 3)/ig, `<span style="color:rgb(231, 176, 57);">$1</span>`);
    result = result.replace(/(: 4)/ig, `<span style="color:rgb(205, 216, 52);">$1</span>`);
    result = result.replace(/(: 5)/ig, `<span style="color:rgb(23, 226, 50);">$1</span>`);
    return result;
}

const log = (str: string) => {
    logStr += formatLogStr(str) + '<br/>';
    const li = document.querySelector('#li2-scroller');
    if (li) {
        li.innerHTML = logStr;
    }

    const li1 = document.querySelector('#li2');
    if (li1) {
        li1.scrollTop = li1.scrollHeight;
    }
    console.info(str);
}

const error = (str: string) => {
    logStr += formatErrorStr(str) + '<br/>';
    const li = document.querySelector('#li2-scroller');
    if (li) {
        li.innerHTML = logStr;
    }

    const li1 = document.querySelector('#li2');
    if (li1) {
        li1.scrollTop = li1.scrollHeight;
    }
    console.info(str);

    const ws1 = document.querySelector<HTMLDivElement>('#workspace1');
    if (ws1) {
        ws1.style.display = 'none';
    }
    const err1 = document.querySelector<HTMLDivElement>('#error1');
    if (err1) {
        err1.style.display = 'flex';
    }
}

const connect = (str: string) => {
    logStr += formatConnectStr(str) + '<br/>';
    const li = document.querySelector('#li2-scroller');
    if (li) {
        li.innerHTML = logStr;
    }

    const li1 = document.querySelector('#li2');
    if (li1) {
        li1.scrollTop = li1.scrollHeight;
    }
    console.info(str);

    const ws1 = document.querySelector<HTMLDivElement>('#workspace1');
    if (ws1) {
        ws1.style.display = 'flex';
    }
    const err1 = document.querySelector<HTMLDivElement>('#error1');
    if (err1) {
        err1.style.display = 'none';
    }
}

const stat = (str: string) => {
    const result = formatStatsStr(str);
    const li = document.querySelector('#li1-scroller');
    if (li) {
        li.innerHTML = result;
    }
    console.info(str);
}

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
            log(`[PENDING] Request: GET ${route}`);
            await req.get(`${channel}/user/${userId}`);
            const finishedTime = Date.now(), delay = finishedTime - startTime;
            log(`[SUCCESS] Request: GET ${route} (${delay}ms)`);
        } catch (err) {
            const finishedTime = Date.now(), delay = finishedTime - startTime;
            log(`[ERROR] Request: GET ${route} (${delay}ms)`);
        }
    },
    createUser: async (userId: string, data: { name: string; }) => {
        const route = `${channel}/user/${userId}`, startTime = Date.now();
        try {
            log(`[PENDING] Request: POST ${route}`);
            await req.post(route, data);
            const finishedTime = Date.now(), delay = finishedTime - startTime;
            log(`[SUCCESS] Request: POST ${route} (${delay}ms)`);
        } catch (err) {
            const finishedTime = Date.now(), delay = finishedTime - startTime;
            log(`[ERROR] Request: POST ${route} (${delay}ms)`);
        }
    },
    updateUser: async (userId: string, data: { name: string; }) => {
        const route = `${channel}/user/${userId}`, startTime = Date.now();
        try {
            log(`[PENDING] Request: PUT ${route}`);
            await req.put(route, data);
            const finishedTime = Date.now(), delay = finishedTime - startTime;
            log(`[SUCCESS] Request: PUT ${route} (${delay}ms)`);
        } catch (err) {
            const finishedTime = Date.now(), delay = finishedTime - startTime;
            log(`[ERROR] Request: PUT ${route} (${delay}ms)`);
        }
    },
    deleteUser: async (userId: string) => {
        const route = `${channel}/user/${userId}`, startTime = Date.now();
        try {
            log(`[PENDING] Request: DELETE ${route}`);
            await req.delete(route);
            const finishedTime = Date.now(), delay = finishedTime - startTime;
            log(`[SUCCESS] Request: DELETE ${route} (${delay}ms)`);
        } catch (err) {
            const finishedTime = Date.now(), delay = finishedTime - startTime;
            log(`[ERROR] Request: DELETE ${route} (${delay}ms)`);
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
    pingTimeout: 2000,
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
        connect(`[CONNECT] Active channel: channel${channelNumber}, status: ${channel.status}`);
    } else {
        error('[ERROR] No communication channels available.');
    }
    const stats = dc.stats;
    let statStr = '';
    for (const id in stats) {
        const num = Number(id) + 1, stat = stats[id];
        statStr += `[channel${num}]: status: ${stat.status}; signal: ${stat.signal} <br/>`;
    }
    stat(statStr);
})

setInterval(() => {
    if (!dc.router) {
        error('[ERROR] No communication channels available.');
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
