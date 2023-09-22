/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { ProjectProgressCountView } from './ProjectProgressCountView';

export type ProjectProgressCountViewListStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: Array<ProjectProgressCountView> | null;
    statusCode?: HttpStatusCode;
    errors?: any;
};
