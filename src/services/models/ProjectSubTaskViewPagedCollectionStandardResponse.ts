/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { ProjectSubTaskViewPagedCollection } from './ProjectSubTaskViewPagedCollection';

export type ProjectSubTaskViewPagedCollectionStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: ProjectSubTaskViewPagedCollection;
    statusCode?: HttpStatusCode;
    errors?: any;
};
