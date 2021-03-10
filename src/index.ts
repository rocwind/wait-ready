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
export type WaitReturn<T, Name extends string> = {
    /**
     * wait for ready, returns a promise that resolves or rejects on ready status change
     */
    [P in `after${Name}Ready`]: AfterReady<T>;
} &
    {
        /**
         * set the ready status to ready/resolved
         */
        [P in `set${Name}Ready`]: ReadyStatusSetter<T>;
    } &
    {
        /**
         * set the ready status to failed/rejected
         */
        [P in `set${Name}Failed`]: ReadyStatusSetter<T>;
    } &
    {
        /**
         * get current ready status
         */
        [P in `get${Name}Status`]: ReadyStatusGetter;
    } &
    {
        /**
         * get the result value or failed reason
         */
        [P in `get${Name}ResultValue`]: ReadyResultValueGetter<T>;
    } &
    {
        /**
         * reset the ready status to pending
         */
        [P in `reset${Name}`]: ReadyStatusSetter<T>;
    };

export const wait = <T, Name extends string = ''>(name?: Name): WaitReturn<T, Name> => {
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

        [`reset${targeName}`]: (value) => {
            setResult(ReadyStatusEnum.Pending, value);
        },
    } as WaitReturn<T, Name>;
};

type ParametersTypes<T> = T extends (...args: infer P) => unknown ? P : [];
type Promisify<T> = T extends Promise<unknown> ? T : Promise<T>;

/**
 * wrap function to have it run after ready promise resolves
 * @param func
 * @param ready promise to wait for
 * @returns wrapped function returns, promisified
 */
export function withReady<T extends (...args: unknown[]) => unknown>(
    func: T,
    ready: Promise<unknown>,
): (...args: ParametersTypes<T>) => Promisify<ReturnType<T>> {
    return ((...args: ParametersTypes<T>) => {
        return ready.then(() => func(...args));
    }) as (...args: ParametersTypes<T>) => Promisify<ReturnType<T>>;
}
