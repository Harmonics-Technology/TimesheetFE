/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContractViewPagedCollection } from './ContractViewPagedCollection';
import type { HttpStatusCode } from './HttpStatusCode';

export type ContractViewPagedCollectionStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: ContractViewPagedCollection;
    statusCode?: HttpStatusCode;
    errors?: any;
};
