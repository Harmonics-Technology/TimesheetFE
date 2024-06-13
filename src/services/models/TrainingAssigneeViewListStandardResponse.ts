/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { TrainingAssigneeView } from './TrainingAssigneeView';

export type TrainingAssigneeViewListStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: Array<TrainingAssigneeView> | null;
    statusCode?: HttpStatusCode;
    errors?: any;
};
