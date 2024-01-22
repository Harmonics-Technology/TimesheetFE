/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { UserDraftViewPagedCollection } from './UserDraftViewPagedCollection';

export type UserDraftViewPagedCollectionStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: UserDraftViewPagedCollection;
    statusCode?: HttpStatusCode;
    errors?: any;
};
