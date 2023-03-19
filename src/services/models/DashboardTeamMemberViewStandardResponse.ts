/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DashboardTeamMemberView } from './DashboardTeamMemberView';
import type { HttpStatusCode } from './HttpStatusCode';

export type DashboardTeamMemberViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: DashboardTeamMemberView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
