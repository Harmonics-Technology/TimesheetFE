/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { PayslipUserViewPagedCollection } from './PayslipUserViewPagedCollection';

export type PayslipUserViewPagedCollectionStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: PayslipUserViewPagedCollection;
    statusCode?: HttpStatusCode;
    errors?: any;
};
