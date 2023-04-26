/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { SwapViewPagedCollection } from './SwapViewPagedCollection';

export type SwapViewPagedCollectionStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: SwapViewPagedCollection;
    statusCode?: HttpStatusCode;
    errors?: any;
};
