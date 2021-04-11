import { withReady } from './withReady';

describe('withReady()', () => {
    it('can wait ready for function withReady', () => {
        const myFunc = (a: number, b: number) => a + b;
        const myFuncWithReady = withReady(myFunc, Promise.resolve());
        return expect(myFuncWithReady(1, 2)).resolves.toBe(3);
    });
});
