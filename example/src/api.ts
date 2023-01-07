import { defineApiClient } from '../../dist';
import { ApiRoutes } from '../generated';

export default defineApiClient<typeof ApiRoutes>({
    routesDef: ApiRoutes,
    baseUrl: 'http://localhost:8044',
});
