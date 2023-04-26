/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { UsersShiftViewPagedCollection } from './UsersShiftViewPagedCollection';

export type UsersShiftViewPagedCollectionStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: UsersShiftViewPagedCollection;
    statusCode?: HttpStatusCode;
    errors?: any;
};
