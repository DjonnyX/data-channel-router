import { DataChannelRouter } from "./DataChannelRouter";

class ExtDataChannelRouter extends DataChannelRouter { }

describe('DataChannelRouter', () => {
    test('DataChannelRouter can not be extended', () => {
        let isError = false;
        try {
            new ExtDataChannelRouter({
                channels: [],
            });
        } catch (error) {
            isError = true;
        }
        expect(isError).toBeTruthy();
    });
});