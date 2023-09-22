/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { ProjectTaskAsigneeViewPagedCollection } from './ProjectTaskAsigneeViewPagedCollection';

export type ProjectTaskAsigneeViewPagedCollectionStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: ProjectTaskAsigneeViewPagedCollection;
    statusCode?: HttpStatusCode;
    errors?: any;
};
