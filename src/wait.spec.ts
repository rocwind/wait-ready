import { wait, ReadyStatusEnum } from './wait';

describe('wait()', () => {
    it('resolves with no value set', () => {
        const { setReady, afterReady } = wait();
        setReady();
        return expect(afterReady()).resolves.toBeUndefined();
    });

    it('resolves with value set', () => {
        const { setReady, afterReady, getResultValue } = wait<number>();
        const value = 1;
        setReady(value);
        expect(getResultValue()).toBe(value);
        return expect(afterReady()).resolves.toBe(value);
    });

    it('rejects with no reason set', () => {
        const { setFailed, afterReady } = wait();
        setFailed();
        return expect(afterReady()).rejects.toBeUndefined();
    });

    it('rejects with reason set', () => {
        const { setFailed, afterReady, getResultValue } = wait<string>();
        const reason = 'unknown error';
        setFailed(reason);
        expect(getResultValue()).toBe(reason);
        return expect(afterReady()).rejects.toBe(reason);
    });

    it('resolves after wait', () => {
        const { setReady, afterReady } = wait();
        const testStep = expect(afterReady()).resolves.toBeUndefined();
        setReady();
        return testStep;
    });

    it('rejects after wait', () => {
        const { setFailed, afterReady } = wait();
        const testStep = expect(afterReady()).rejects.toBeUndefined();
        setFailed();
        return testStep;
    });

    it('status should turn to ready after setReady', () => {
        const { setReady, getStatus } = wait();
        expect(getStatus()).toBe(ReadyStatusEnum.Pending);
        setReady();
        expect(getStatus()).toBe(ReadyStatusEnum.Ready);
    });

    it('status should turn to failed after setFailed', () => {
        const { setFailed, getStatus } = wait();
        expect(getStatus()).toBe(ReadyStatusEnum.Pending);
        setFailed();
        expect(getStatus()).toBe(ReadyStatusEnum.Failed);
    });

    it('cannot change result after set ready once', () => {
        const { setReady, afterReady } = wait();
        setReady();
        setReady('another call');
        return expect(afterReady()).resolves.toBeUndefined();
    });

    it('can reset to pending status', () => {
        const { setReady, getStatus, reset } = wait();
        expect(getStatus()).toBe(ReadyStatusEnum.Pending);
        setReady();
        expect(getStatus()).toBe(ReadyStatusEnum.Ready);
        reset();
        expect(getStatus()).toBe(ReadyStatusEnum.Pending);
    });

    it('can set target name', () => {
        const { setMyTaskReady, afterMyTaskReady } = wait('MyTask');
        setMyTaskReady();
        return expect(afterMyTaskReady()).resolves.toBeUndefined();
    });
});
