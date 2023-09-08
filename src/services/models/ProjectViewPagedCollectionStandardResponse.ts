/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { ProjectViewPagedCollection } from './ProjectViewPagedCollection';

export type ProjectViewPagedCollectionStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: ProjectViewPagedCollection;
    statusCode?: HttpStatusCode;
    errors?: any;
};
