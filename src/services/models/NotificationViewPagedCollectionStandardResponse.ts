/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { NotificationViewPagedCollection } from './NotificationViewPagedCollection';

export type NotificationViewPagedCollectionStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: NotificationViewPagedCollection;
    statusCode?: HttpStatusCode;
    errors?: any;
};
