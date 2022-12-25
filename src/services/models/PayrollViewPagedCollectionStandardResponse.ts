/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { PayrollViewPagedCollection } from './PayrollViewPagedCollection';

export type PayrollViewPagedCollectionStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: PayrollViewPagedCollection;
    statusCode?: HttpStatusCode;
    errors?: any;
};
