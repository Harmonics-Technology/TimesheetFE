/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { InvoiceViewPagedCollection } from './InvoiceViewPagedCollection';

export type InvoiceViewPagedCollectionStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: InvoiceViewPagedCollection;
    statusCode?: HttpStatusCode;
    errors?: any;
};
