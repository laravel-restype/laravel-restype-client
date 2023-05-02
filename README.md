# Laravel-RESType-Client (BETA) - add type-safety to your RESTful API

This project has 2 components:

-   [laravel-restype](https://github.com/laravel-restype/laravel-restype) - laravel server / generates the typescript definitions
-   [**laravel-restype-client**](https://github.com/laravel-restype/laravel-restype-client) - generic typescript client / consumes the typescript definitions generated

**Warning ! Beta software !** please don't use this in production yet !

### What is this ?

I saw the tRPC project and I wanted something similar, but for my existing Laravel projects.

After a quick google search I found the awesome project [spatie/typescript-transformer](https://github.com/spatie/typescript-transformer), however the integration with laravel is very barebones, serving as a building block.

This project helps you generate TypeScript definitions for your entire existing laravel REST api. After the definition is generated, you can import it in your frontend, or download it into your react-native project.

## Install

```bash
npm install laravel-restype-client
```

```bash
yarn add laravel-restype-client
```

## Usage

1. After you followed the steps from the [server package documentation](https://github.com/laravel-restype/laravel-restype#readme) and you generated your typescript definitions, download your ts file in your frontend package (default file location: `/public/types/generated.ts`).

You can place it anywhere in your frontend project. (example `src/generated.ts`)

2. Initialize the api client, providing the typescript file and a base endpoint url.

`src/api.ts`

```typescript
import { defineApiClient } from 'laravel-restype-client';
import { ApiRoutes } from './generated';

export default defineApiClient<typeof ApiRoutes>({
    routesDef: ApiRoutes,
    baseUrl: 'http://localhost:8044/api',

    // you can also choose that request library you want to use:
    // driver: fetchDriver(), // import { fetchDriver } from 'laravel-restype-client/drivers/fetch';
    // driver: axiosDriver(), // import { axiosDriver } from 'laravel-restype-client/drivers/axios'; // NOT implemented yet
});
```

3. Happy type-safe coding !

```typescript
import api from './api';

api.helloWorld({})
    .then((data) => {
        if (data.hello == 'world') {
            alert(data.message);
        }
    })
    .catch((error) => {
        console.log('ERR', error);
    });
```

# Roadmap:

|          |                                                  |
| -------- | ------------------------------------------------ |
| &#x2610; | Support url parameters (eg. `/post/{id}`)        |
| &#x2610; | Support file type, convert json body to FormData |

# Changelog:

### v0.1.1 - 2023-05-01

-   Added support for route params

### v0.1 - 2023-01-07

-   First version
