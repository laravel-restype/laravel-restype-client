class api {
    baseUrl;
    constructor(ApiRoutes) {
        Object.keys(ApiRoutes || {}).forEach((key) => {
            const routeData = ApiRoutes[key];
            this[key] = ({ params = undefined, query = undefined, body = undefined, }, extraOptions = {}) => {
                return new Promise((resolve, reject) => {
                    // TODO: replace params in url
                    this.request(routeData.method, routeData.url, routeData.method == 'GET' ? query : body, extraOptions)
                        .then((response) => {
                        resolve(response);
                    })
                        .catch((error) => {
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
    request = (method, url, data, extraOptions = {}) => {
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
            let options = {
                method: method,
                url: url,
                headers: headers,
            };
            if (method == 'GET')
                options.params = data;
            else
                options.data = data;
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
const defineApiClient = (options) => {
    const ApiRoutes = options.ApiRoutes || {};
    return new api(ApiRoutes);
};

export { defineApiClient };
