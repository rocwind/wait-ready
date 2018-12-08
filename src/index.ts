export type WaitForReady = () => Promise<any>;
export type ReadyStatusSetter = (value?: any) => void;

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
}

export const beginWait = (): BeginWaitReturn => {
    let settled: boolean = false;
    let resolved: boolean = false;
    let value: any;
    let waitPromise: Promise<any>;
    let waitPromiseResolve: (value) => void;
    let waitPromiseReject: (value) => void;

    return {
        wait: () => {
            if (settled) {
                return resolved
                    ? Promise.resolve(value)
                    : Promise.reject(value);
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
            if (settled) {
                return;
            }
            settled = true;
            resolved = true;
            value = result;
            if (waitPromiseResolve) {
                waitPromiseResolve(result);
                waitPromiseResolve = null;
                waitPromiseReject = null;
                waitPromise = null;
            }
        },
        setFailed: (reason) => {
            if (settled) {
                return;
            }
            settled = true;
            resolved = false;
            value = reason;
            if (waitPromiseReject) {
                waitPromiseReject(reason);
                waitPromiseResolve = null;
                waitPromiseReject = null;
                waitPromise = null;
            }
        },
    };
}
