import { DataChannel, DataChannelRouter, IDataChannel } from './DC';

const channel1 = new DataChannel({
    // etc
});
const channel2 = new DataChannel({
    // etc
});
const channel3 = new DataChannel({
    // etc
});

const channels: Array<IDataChannel> = [
    channel1, channel2, channel3,
];

new DataChannelRouter({
    channels,
});