/**
 * Ready Status
 */
export enum ReadyStatusEnum {
    Pending = 0,
    Ready = 1,
    Failed = -1,
}

export type ReadyStatusSetter<T> = (value?: T) => void;
export type ReadyStatusGetter = () => ReadyStatusEnum;
export type ReadyResultValueGetter<T> = () => T;
export type AfterReady<T> = () => Promise<T>;

/**
 * The return object of wait()
 */
export interface WaitReturn<T> {
    /**
     * wait for ready, returns a promise that resolves or rejects on ready status change
     */
    afterReady: AfterReady<T>;
    /**
     * set the ready status to ready/resolved
     */
    setReady: ReadyStatusSetter<T>;
    /**
     * set the ready status to failed/rejected
     */
    setFailed: ReadyStatusSetter<T>;
    /**
     * get current ready status
     */
    getStatus: ReadyStatusGetter;
    /**
     * get the result value or failed reason
     */
    getResultValue: ReadyResultValueGetter<T>;
    /**
     * reset the ready status to pending
     */
    reset: ReadyStatusSetter<T>;
}

export const wait = <T>(): WaitReturn<T> => {
    let readyStatus: ReadyStatusEnum = ReadyStatusEnum.Pending;
    let resultValue: T;
    let waitPromise: Promise<T>;
    let waitPromiseResolve: (value: T) => void;
    let waitPromiseReject: (value: T) => void;

    const setResult = (status: ReadyStatusEnum, value?: T) => {
        // skip set to same status
        if (readyStatus === status) {
            return;
        }
        // cannot set ready status to fail or vice vesa
        if (readyStatus !== ReadyStatusEnum.Pending && status !== ReadyStatusEnum.Pending) {
            return;
        }
        readyStatus = status;
        resultValue = value;
        switch (status) {
            case ReadyStatusEnum.Ready:
                if (waitPromiseResolve) {
                    waitPromiseResolve(resultValue);
                }
                break;
            case ReadyStatusEnum.Failed:
                if (waitPromiseReject) {
                    waitPromiseReject(resultValue);
                }
                break;
            default:
                break;
        }
        waitPromiseResolve = null;
        waitPromiseReject = null;
        waitPromise = null;
    };

    return {
        afterReady: () => {
            switch (readyStatus) {
                case ReadyStatusEnum.Ready:
                    return Promise.resolve(resultValue);
                case ReadyStatusEnum.Failed:
                    return Promise.reject(resultValue);
                case ReadyStatusEnum.Pending:
                default:
                    break;
            }

            if (!waitPromise) {
                waitPromise = new Promise((resolve, reject) => {
                    waitPromiseResolve = resolve;
                    waitPromiseReject = reject;
                });
            }
            return waitPromise;
        },

        setReady: value => {
            setResult(ReadyStatusEnum.Ready, value);
        },

        setFailed: reason => {
            setResult(ReadyStatusEnum.Failed, reason);
        },

        getStatus: () => readyStatus,

        getResultValue: () => resultValue,

        reset: value => {
            setResult(ReadyStatusEnum.Pending, value);
        },
    };
};
