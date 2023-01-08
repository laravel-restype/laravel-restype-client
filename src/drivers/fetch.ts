import { ApiDriver, ApiDriverOptions } from './index';

export const fetchDriver = <R>(): ApiDriver<R> => {
    return (options) => {
        return new Promise((resolve, reject) => {
            let url: string = options.url;
            if (options.query) {
                url += '?' + new URLSearchParams(options.query).toString();
            }
            const fetchOptions: Pick<ApiDriverOptions, 'method' | 'headers' | 'body'> & {
                credentials?: string;
            } = {
                method: String(options.method).toUpperCase(),
                headers: options.headers || {},
                body: options.body
                    ? options.body instanceof FormData
                        ? options.body
                        : JSON.stringify(options.body)
                    : undefined,
            };
            if (
                Object.keys(fetchOptions.headers)
                    .map((i) => String(i).toLowerCase())
                    .indexOf('authorization') !== -1
            ) {
                fetchOptions.credentials = 'include';
            }

            fetch(url, {
                ...fetchOptions,
                ...(options?.extraOptions?.fetchOptions || {}),
            })
                .then((rawResponse) => {
                    rawResponse
                        .json()
                        .then((response) => {
                            resolve(response as R);
                        })
                        .catch((error) => reject(error));
                })
                .catch((error) => reject(error));
        });
    };
};
