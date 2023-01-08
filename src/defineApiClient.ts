import { ApiDriver, ApiDriverOptions } from './drivers';
import { fetchDriver } from './drivers/fetch';

class api<T extends ApiRouteDefaultProps> {
    baseUrl: string;
    apiClientDriver: ApiDriver<T['response']>;

    constructor(options: ApiClientOptions<T>) {
        this.baseUrl = options.baseUrl;
        this.apiClientDriver = options.driver;
        Object.keys(options.routesDef || {}).forEach((key) => {
            const routeData = options.routesDef[key];
            this[key] = (
                {
                    params = undefined,
                    query = undefined,
                    body = undefined,
                }: {
                    params: typeof routeData['params'];
                    query: typeof routeData['query'];
                    body: typeof routeData['body'];
                },
                extraOptions: any = {},
            ): Promise<typeof routeData['response']> => {
                return new Promise((resolve, reject) => {
                    // TODO: replace params in url
                    this.request(routeData.method, routeData.url, { query, body, extraOptions })
                        .then((response: any) => {
                            resolve(response as typeof routeData['response']);
                        })
                        .catch((error: any) => {
                            reject(error);
                        });
                });
            };
        });
        return this;
    }

    get = (url, data) => {
        return this.request('GET', url, { query: data });
    };
    post = (url, data) => {
        return this.request('POST', url, { body: data });
    };
    put = (url, data) => {
        return this.request('PUT', url, { body: data });
    };
    patch = (url, data) => {
        return this.request('PATCH', url, { body: data });
    };
    delete = (url, data) => {
        return this.request('DELETE', url, { body: data });
    };
    options = (url, data) => {
        return this.request('OPTIONS', url, { body: data });
    };

    // Prepare a request to send
    request = (
        method,
        url,
        {
            query = undefined,
            body = undefined,
            extraOptions = {},
        }: {
            query?: { [key: string]: string | number };
            body?: any;
            extraOptions?: any;
        },
    ) => {
        return new Promise((resolve, reject) => {
            method = method.toUpperCase();
            url = this.baseUrl + url;
            let headers = {};
            // TODO: iterate on data to find a file param, then convert the entire object to formdata
            headers['Content-Type'] = body instanceof FormData ? 'multipart/form-data' : 'application/json';

            this.sendRequest(
                method,
                url,
                { ...headers, ...(extraOptions?.headers || {}) },
                { query, body, extraOptions },
            )
                .then((response) => {
                    resolve(response);
                })
                .catch((response) => {
                    reject(response);
                });
        });
    };

    // Send the actual http request
    sendRequest = (method, url, headers, data) => {
        return new Promise((resolve, reject) => {
            let options: ApiDriverOptions = {
                method: method,
                url: url,
                headers: headers,
                query: data.query || undefined,
                body: data.body || undefined,
                extraOptions: data.extraOptions || undefined,
            };
            this.apiClientDriver(options)
                .then((response) => {
                    resolve(response);
                })
                .catch((response) => {
                    reject(response);
                });
        });
    };
}

interface ApiRouteDefaultProps {
    [key: string]: {
        method: string;
        url: string;
        params?: any;
        query?: any;
        body?: any;
        response: any;
    };
}

type ApiRoutesInterface<T extends ApiRouteDefaultProps> = {
    [key in keyof T]: (
        { params = undefined, query = undefined, body = undefined }: Omit<T[key], 'response' | 'method' | 'url'>,
        extraOptions?: any,
    ) => Promise<T[key]['response']>;
};
type ApiInstance<T extends ApiRouteDefaultProps> = api<T> & ApiRoutesInterface<T>;

interface ApiClientOptions<T extends ApiRouteDefaultProps> {
    routesDef: ApiRouteDefaultProps;
    baseUrl: string;
    driver?: ApiDriver<T['response']>;
}

export const defineApiClient = <T extends ApiRouteDefaultProps>({
    driver = fetchDriver(),
    ...options
}: ApiClientOptions<T>): ApiInstance<T> => {
    const finalOptions: ApiClientOptions<T> = { ...options, driver };
    return new api<T>(finalOptions) as ApiInstance<T>;
};
