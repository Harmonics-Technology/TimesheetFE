/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { ResourceCapacityDetailView } from './ResourceCapacityDetailView';

export type ResourceCapacityDetailViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: ResourceCapacityDetailView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
