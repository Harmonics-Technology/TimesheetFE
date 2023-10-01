/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DashboardProjectManagementView } from './DashboardProjectManagementView';
import type { HttpStatusCode } from './HttpStatusCode';

export type DashboardProjectManagementViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: DashboardProjectManagementView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
