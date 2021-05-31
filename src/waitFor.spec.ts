import { waitFor } from './waitFor';

describe('waitFor()', () => {
    beforeEach(() => {
        jest.useFakeTimers('legacy');
    });

    it('resolves after second check', () => {
        const check = jest.fn();
        check.mockReturnValueOnce(false);
        check.mockReturnValueOnce(true);

        const result = waitFor(check);
        jest.runAllTimers();

        expect(check).toHaveBeenCalledTimes(2);
        expect(setTimeout).toHaveBeenCalledTimes(1);
        return expect(result).resolves.toEqual(true);
    });

    it('rejects when check throws error', () => {
        const check = jest.fn();
        check.mockReturnValueOnce(false);
        check.mockImplementationOnce(() => {
            throw new Error('check error');
        });

        const result = waitFor(check);
        jest.runAllTimers();

        expect(check).toHaveBeenCalledTimes(2);
        expect(setTimeout).toHaveBeenCalledTimes(1);
        return expect(result).rejects.toEqual(new Error('check error'));
    });
});
