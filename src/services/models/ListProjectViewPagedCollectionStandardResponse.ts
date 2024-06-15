/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { ListProjectViewPagedCollection } from './ListProjectViewPagedCollection';

export type ListProjectViewPagedCollectionStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: ListProjectViewPagedCollection;
    statusCode?: HttpStatusCode;
    errors?: any;
};
