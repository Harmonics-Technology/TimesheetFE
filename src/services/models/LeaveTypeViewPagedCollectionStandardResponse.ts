/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { LeaveTypeViewPagedCollection } from './LeaveTypeViewPagedCollection';

export type LeaveTypeViewPagedCollectionStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: LeaveTypeViewPagedCollection;
    statusCode?: HttpStatusCode;
    errors?: any;
};
