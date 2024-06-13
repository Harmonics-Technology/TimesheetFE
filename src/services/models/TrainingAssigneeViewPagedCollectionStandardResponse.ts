/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { TrainingAssigneeViewPagedCollection } from './TrainingAssigneeViewPagedCollection';

export type TrainingAssigneeViewPagedCollectionStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: TrainingAssigneeViewPagedCollection;
    statusCode?: HttpStatusCode;
    errors?: any;
};
