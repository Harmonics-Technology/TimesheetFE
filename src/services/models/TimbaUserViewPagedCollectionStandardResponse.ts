/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { TimbaUserViewPagedCollection } from './TimbaUserViewPagedCollection';

export type TimbaUserViewPagedCollectionStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: TimbaUserViewPagedCollection;
    statusCode?: HttpStatusCode;
    errors?: any;
};
