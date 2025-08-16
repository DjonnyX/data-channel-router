import { DataChannel } from "./DataChannel";

class ExtDataChannel extends DataChannel { }

describe('DataChannel', () => {
    test('DataChannel can not be extended', () => {
        let isError = false;
        try {
            new ExtDataChannel({ channels: [] });
        } catch (error) {
            isError = true;
        }
        expect(isError).toBeTruthy();
    });
});