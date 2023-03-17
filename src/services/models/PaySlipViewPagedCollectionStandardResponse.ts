/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { PaySlipViewPagedCollection } from './PaySlipViewPagedCollection';

export type PaySlipViewPagedCollectionStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: PaySlipViewPagedCollection;
    statusCode?: HttpStatusCode;
    errors?: any;
};
