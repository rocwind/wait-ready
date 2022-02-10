/**
 * Ready Status
 */
export enum ReadyStatusEnum {
    Pending = 0,
    Ready = 1,
    Failed = -1,
}

type Setter<T> = (value?: T) => void;

/**
 * The return object of wait()
 */
export type WaitReturn<T, Name extends string = ''> = {
    /**
     * wait for ready, returns a promise that resolves or rejects on ready status change
     */
    [P in `after${Name}Ready`]: () => Promise<T>;
} & {
    /**
     * set the ready status to ready/resolved
     */
    [P in `set${Name}Ready`]: Setter<T>;
} & {
    /**
     * set the ready status to failed/rejected
     */
    [P in `set${Name}Failed`]: Setter<Error>;
} & {
    /**
     * get current ready status
     */
    [P in `get${Name}Status`]: () => ReadyStatusEnum;
} & {
    /**
     * get the result value
     */
    [P in `get${Name}ResultValue`]: () => T;
} & {
    /**
     * get the fail reason
     */
    [P in `get${Name}FailReason`]: () => Error;
} & {
    /**
     * reset the ready status to pending
     */
    [P in `reset${Name}`]: () => void;
};

export function wait<T, Name extends string = ''>(name?: Name): WaitReturn<T, Name> {
    let readyStatus: ReadyStatusEnum = ReadyStatusEnum.Pending;
    let resultValue: T | Error;
    let waitPromise: Promise<T>;
    let waitPromiseResolve: (value: T) => void;
    let waitPromiseReject: (value: Error) => void;

    const setResult = (status: ReadyStatusEnum, value?: T | Error) => {
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
                    waitPromiseResolve(resultValue as T);
                }
                break;
            case ReadyStatusEnum.Failed:
                if (waitPromiseReject) {
                    waitPromiseReject(resultValue as Error);
                }
                break;
            default:
                break;
        }
        waitPromiseResolve = null;
        waitPromiseReject = null;
        waitPromise = null;
    };

    const targeName = name ?? '';
    return {
        [`after${targeName}Ready`]: () => {
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

        [`set${targeName}Ready`]: (value) => {
            setResult(ReadyStatusEnum.Ready, value);
        },

        [`set${targeName}Failed`]: (reason) => {
            setResult(ReadyStatusEnum.Failed, reason);
        },

        [`get${targeName}Status`]: () => readyStatus,
        [`get${targeName}ResultValue`]: () => resultValue,
        [`get${targeName}FailReason`]: () => resultValue,

        [`reset${targeName}`]: () => {
            setResult(ReadyStatusEnum.Pending, undefined);
        },
    } as WaitReturn<T, Name>;
}
