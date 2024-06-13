/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { TrainingViewPagedCollection } from './TrainingViewPagedCollection';

export type TrainingViewPagedCollectionStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: TrainingViewPagedCollection;
    statusCode?: HttpStatusCode;
    errors?: any;
};
