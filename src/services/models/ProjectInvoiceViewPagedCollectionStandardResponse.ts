/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { ProjectInvoiceViewPagedCollection } from './ProjectInvoiceViewPagedCollection';

export type ProjectInvoiceViewPagedCollectionStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: ProjectInvoiceViewPagedCollection;
    statusCode?: HttpStatusCode;
    errors?: any;
};
