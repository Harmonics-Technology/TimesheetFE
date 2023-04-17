/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { ShiftUsersListViewPagedCollection } from './ShiftUsersListViewPagedCollection';

export type ShiftUsersListViewPagedCollectionStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: ShiftUsersListViewPagedCollection;
    statusCode?: HttpStatusCode;
    errors?: any;
};
