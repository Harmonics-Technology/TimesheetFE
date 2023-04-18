/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { ShiftViewPagedCollection } from './ShiftViewPagedCollection';

export type ShiftViewPagedCollectionStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: ShiftViewPagedCollection;
    statusCode?: HttpStatusCode;
    errors?: any;
};
