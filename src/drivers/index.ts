export interface ApiDriverOptions {
    method: string;
    url: string;
    headers?: { [key: string]: string };
    params?: any;
    query?: any;
    body?: any;
    extraOptions?: any;
}
export interface ApiDriver<R> {
    (options: ApiDriverOptions): Promise<R>;
}
