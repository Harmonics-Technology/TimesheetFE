/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { SuperAdminDashboardView } from './SuperAdminDashboardView';

export type SuperAdminDashboardViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: SuperAdminDashboardView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
