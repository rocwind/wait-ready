import { beginWait, ReadyStatusEnum } from '../index';

it('resolves with no value set', () => {
    const { setReady, wait } = beginWait();
    setReady();
    return expect(wait()).resolves.toBeUndefined();
});

it('resolves with value set', () => {
    const { setReady, wait, getResultValue } = beginWait();
    const value = 1;
    setReady(value);
    expect(getResultValue()).toBe(value);
    return expect(wait()).resolves.toBe(value);
});

it('rejects with no reason set', () => {
    const { setFailed, wait } = beginWait();
    setFailed();
    return expect(wait()).rejects.toBeUndefined();
});

it('rejects with reason set', () => {
    const { setFailed, wait, getResultValue } = beginWait();
    const reason = 'unknown error';
    setFailed(reason);
    expect(getResultValue()).toBe(reason);
    return expect(wait()).rejects.toBe(reason);
});

it('resolves after wait', () => {
    const { setReady, wait } = beginWait();
    const testStep = expect(wait()).resolves.toBeUndefined();
    setReady();
    return testStep;
});

it('rejects after wait', () => {
    const { setFailed, wait } = beginWait();
    const testStep = expect(wait()).rejects.toBeUndefined();
    setFailed();
    return testStep;
});

it('status should turn to ready after setReady', () => {
    const { setReady, getStatus } = beginWait();
    expect(getStatus()).toBe(ReadyStatusEnum.Pending);
    setReady();
    expect(getStatus()).toBe(ReadyStatusEnum.Ready);
});

it('status should turn to failed after setFailed', () => {
    const { setFailed, getStatus } = beginWait();
    expect(getStatus()).toBe(ReadyStatusEnum.Pending);
    setFailed();
    expect(getStatus()).toBe(ReadyStatusEnum.Failed);
});

it('cannot change result after set ready once', () => {
    const { setReady, wait } = beginWait();
    setReady();
    setReady('another call');
    return expect(wait()).resolves.toBeUndefined();
});

it('has no effect to set pending status', () => {
    const { setReady, setResult, wait, getStatus } = beginWait();
    setResult(ReadyStatusEnum.Pending, 'something ignored');
    expect(getStatus()).toBe(ReadyStatusEnum.Pending);
    setReady();
    expect(getStatus()).toBe(ReadyStatusEnum.Ready);
    return expect(wait()).resolves.toBeUndefined();
});

