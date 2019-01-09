export type WaitForReady = () => Promise<any>;
export type ReadyStatusSetter = (value?: any) => void;
export enum ReadyStatusEnum {
    Pending = 0,
    Ready = 1,
    Failed = -1,
}
export type ReadyStatusGetter = () => ReadyStatusEnum;

/**
 * The return object of beginWait()
 */
export interface BeginWaitReturn {
    /**
     * wait for ready, returns a promise that resolves or rejects on ready status change
     */
    wait: WaitForReady,
    /**
     * set the ready status to resolved
     */
    setReady: ReadyStatusSetter,
    /**
     * set the ready status to rejected
     */
    setFailed: ReadyStatusSetter,
    /**
     * get current ready status
     */
    getStatus: ReadyStatusGetter,
}

export const beginWait = (): BeginWaitReturn => {
    let readyStatus: ReadyStatusEnum = ReadyStatusEnum.Pending;
    let value: any;
    let waitPromise: Promise<any>;
    let waitPromiseResolve: (value) => void;
    let waitPromiseReject: (value) => void;

    return {
        wait: () => {
            switch (readyStatus) {
                case ReadyStatusEnum.Ready:
                    return Promise.resolve(value);
                case ReadyStatusEnum.Failed:
                    return Promise.reject(value)
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

        setReady: (result) => {
            if (readyStatus !== ReadyStatusEnum.Pending) {
                return;
            }
            readyStatus = ReadyStatusEnum.Ready;
            value = result;
            if (waitPromiseResolve) {
                waitPromiseResolve(result);
                waitPromiseResolve = null;
                waitPromiseReject = null;
                waitPromise = null;
            }
        },

        setFailed: (reason) => {
            if (readyStatus !== ReadyStatusEnum.Pending) {
                return;
            }
            readyStatus = ReadyStatusEnum.Failed;
            value = reason;
            if (waitPromiseReject) {
                waitPromiseReject(reason);
                waitPromiseResolve = null;
                waitPromiseReject = null;
                waitPromise = null;
            }
        },

        getStatus: () => readyStatus,
    };
}
