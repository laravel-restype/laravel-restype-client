export interface ApiDriverOptions {
    method: string;
    url: string;
    headers?: { [key: string]: string };
    query?: any;
    body?: any;
    extraOptions?: any;
}
export interface ApiDriver<R> {
    (options: ApiDriverOptions): Promise<R>;
}
