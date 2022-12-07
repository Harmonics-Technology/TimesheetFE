/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DashboardView } from './DashboardView';
import type { HttpStatusCode } from './HttpStatusCode';

export type DashboardViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: DashboardView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
