declare class api {
    baseUrl: string;
    constructor(ApiRoutes: any);
    get: (url: any, data: any) => Promise<unknown>;
    post: (url: any, data: any) => Promise<unknown>;
    put: (url: any, data: any) => Promise<unknown>;
    patch: (url: any, data: any) => Promise<unknown>;
    delete: (url: any, data: any) => Promise<unknown>;
    options: (url: any, data: any) => Promise<unknown>;
    request: (method: any, url: any, data: any, extraOptions?: any) => Promise<unknown>;
    sendRequest: (method: any, url: any, headers: any, data: any) => Promise<unknown>;
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
    [key in keyof T]: ({ params, query, body, }: Omit<T[key], 'response' | 'method' | 'url'>) => Promise<T[key]['response']>;
};
type ApiInstance<T extends ApiRouteDefaultProps> = api & ApiRoutesInterface<T>;
interface ApiClientOptions {
    routesDef: any;
    baseUrl: string;
}
export declare const defineApiClient: <T extends ApiRouteDefaultProps>(options: ApiClientOptions) => ApiInstance<T>;
export {};
