class api {
    baseUrl: string;

    constructor(ApiRoutes) {
        Object.keys(ApiRoutes || {}).forEach((key) => {
            const routeData = ApiRoutes[key];
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
                    this.request(
                        routeData.method,
                        routeData.url,
                        routeData.method == 'GET' ? query : body,
                        extraOptions,
                    )
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
        return this.request('GET', url, data);
    };
    post = (url, data) => {
        return this.request('POST', url, data);
    };
    put = (url, data) => {
        return this.request('PUT', url, data);
    };
    patch = (url, data) => {
        return this.request('PATCH', url, data);
    };
    delete = (url, data) => {
        return this.request('DELETE', url, data);
    };
    options = (url, data) => {
        return this.request('OPTIONS', url, data);
    };

    // Prepare a request to send
    request = (method, url, data, extraOptions: any = {}) => {
        return new Promise((resolve, reject) => {
            method = method.toUpperCase();
            url = this.baseUrl + url;
            let headers = {};
            // TODO: iterate on data to find a file param, then convert the entire object to formdata
            headers['Content-Type'] = data instanceof FormData ? 'multipart/form-data' : 'application/json';

            this.sendRequest(method, url, { ...headers, ...(extraOptions?.headers || {}) }, data)
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
            let options: any = {
                method: method,
                url: url,
                headers: headers,
            };
            if (method == 'GET') options.params = data;
            else options.data = data;
            fetch(options)
                .then((response) => {
                    resolve(response);
                })
                .catch(({ response }) => {
                    resolve(response);
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
    [key in keyof T]: ({
        params = undefined,
        query = undefined,
        body = undefined,
    }: Omit<T[key], 'response' | 'method' | 'url'>) => Promise<T[key]['response']>;
};
type ApiInstance<T extends ApiRouteDefaultProps> = api & ApiRoutesInterface<T>;

interface ApiClientOptions {
    ApiRoutes: any;
}

export const defineApiClient = <T extends ApiRouteDefaultProps>(options: ApiClientOptions): ApiInstance<T> => {
    const ApiRoutes = options.ApiRoutes || {};
    return new api(ApiRoutes) as ApiInstance<T>;
};
