import { ApiDriver, ApiDriverOptions } from './index';

export const axiosDriver = <R>(): ApiDriver<R> => {
    return (options) => {
        return new Promise((resolve, reject) => {});
    };
};
