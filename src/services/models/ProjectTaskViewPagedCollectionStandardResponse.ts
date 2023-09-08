/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { ProjectTaskViewPagedCollection } from './ProjectTaskViewPagedCollection';

export type ProjectTaskViewPagedCollectionStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: ProjectTaskViewPagedCollection;
    statusCode?: HttpStatusCode;
    errors?: any;
};
