/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { TrainingMaterialViewPagedCollection } from './TrainingMaterialViewPagedCollection';

export type TrainingMaterialViewPagedCollectionStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: TrainingMaterialViewPagedCollection;
    statusCode?: HttpStatusCode;
    errors?: any;
};
