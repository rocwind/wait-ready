import { wait } from './wait';

/**
 * check function that returns check result
 * falsy values means not ready, truthy values will be used to resolve the promise
 */
type WaitForCheckFun<T> = () => T;

interface WaitForOptions {
    /**
     * the interval(ms) for each check, default to 200ms
     */
    checkInterval?: number;
    /**
     * throw a timeout error and reject the promise after given timeout(ms),
     * default is no timeout
     */
    timeout?: number;
}

export function waitFor<T>(check: WaitForCheckFun<T>, options?: WaitForOptions): Promise<T> {
    const { checkInterval = 200, timeout } = options ?? {};

    const { afterReady, setReady, setFailed } = wait<T>();

    const startTimestamp = Date.now();
    const doCheck = () => {
        try {
            const result = check();
            if (result) {
                setReady(result);
                return;
            }

            if (timeout && Date.now() - startTimestamp > timeout) {
                setFailed(new Error('timeout'));
                return;
            }

            setTimeout(doCheck, checkInterval);
        } catch (err) {
            setFailed(err);
        }
    };
    doCheck();

    return afterReady();
}
