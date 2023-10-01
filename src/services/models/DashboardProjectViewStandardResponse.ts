/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DashboardProjectView } from './DashboardProjectView';
import type { HttpStatusCode } from './HttpStatusCode';

export type DashboardProjectViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: DashboardProjectView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
