/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AuditrailViewPagedCollection } from './AuditrailViewPagedCollection';
import type { HttpStatusCode } from './HttpStatusCode';

export type AuditrailViewPagedCollectionStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: AuditrailViewPagedCollection;
    statusCode?: HttpStatusCode;
    errors?: any;
};
