export type WaitForReady = () => Promise<any>;
export enum ReadyStatusEnum {
    Pending = 0,
    Ready = 1,
    Failed = -1,
}
/**
 * short cut method for set ready result
 */
export type ReadyStatusSetter = (value?: any) => void;
export type ReadyStatusGetter = () => ReadyStatusEnum;
export type ReadyResultValueGetter = () => any;

/**
 * The return object of beginWait()
 */
export interface BeginWaitReturn {
    /**
     * wait for ready, returns a promise that resolves or rejects on ready status change
     */
    wait: WaitForReady,
    /**
     * set the ready status to ready/resolved
     */
    setReady: ReadyStatusSetter,
    /**
     * set the ready status to failed/rejected
     */
    setFailed: ReadyStatusSetter,
    /**
     * get current ready status
     */
    getStatus: ReadyStatusGetter,
    /**
     * get the result value or failed reason
     */
    getResultValue: ReadyResultValueGetter,
    /**
     * reset the ready status to pending
     */
    reset: ReadyStatusSetter,
}

export const beginWait = (): BeginWaitReturn => {
    let readyStatus: ReadyStatusEnum = ReadyStatusEnum.Pending;
    let resultValue: any;
    let waitPromise: Promise<any>;
    let waitPromiseResolve: (value) => void;
    let waitPromiseReject: (value) => void;

    const setResult = (status: ReadyStatusEnum, value?: any) => {
        // skip set to same status
        if (readyStatus === status) {
            return;
        }
        // cannot set ready status to fail or vice vesa
        if (readyStatus !== ReadyStatusEnum.Pending
            && status !== ReadyStatusEnum.Pending) {
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
        wait: () => {
            switch (readyStatus) {
                case ReadyStatusEnum.Ready:
                    return Promise.resolve(resultValue);
                case ReadyStatusEnum.Failed:
                    return Promise.reject(resultValue)
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

        setReady: (value) => {
            setResult(ReadyStatusEnum.Ready, value);
        },

        setFailed: (reason) => {
            setResult(ReadyStatusEnum.Failed, reason);
        },

        getStatus: () => readyStatus,

        getResultValue: () => resultValue,

        reset: (value) => {
            setResult(ReadyStatusEnum.Pending, value);
        },
    };
}
