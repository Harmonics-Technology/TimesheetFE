/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { LicenseUpdateAuditLogViewPagedCollection } from './LicenseUpdateAuditLogViewPagedCollection';

export type LicenseUpdateAuditLogViewPagedCollectionStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: LicenseUpdateAuditLogViewPagedCollection;
    statusCode?: HttpStatusCode;
    errors?: any;
};
