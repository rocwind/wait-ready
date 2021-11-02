type Promisify<T> = T extends Promise<unknown> ? T : Promise<T>;

/**
 * wrap function to have it run after ready promise resolves
 * @param func
 * @param ready promise to wait for
 * @returns wrapped function returns, promisified
 */
export function withReady<T extends (...args: never[]) => unknown>(
    func: T,
    ready: Promise<unknown>,
): (...args: Parameters<T>) => Promisify<ReturnType<T>> {
    return ((...args: Parameters<T>) => {
        return ready.then(() => func(...args));
    }) as (...args: Parameters<T>) => Promisify<ReturnType<T>>;
}
