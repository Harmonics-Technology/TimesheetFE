/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { ResourceCapacityView } from './ResourceCapacityView';

export type ResourceCapacityViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: ResourceCapacityView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
