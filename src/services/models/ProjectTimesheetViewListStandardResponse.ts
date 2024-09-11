/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { ProjectTimesheetView } from './ProjectTimesheetView';

export type ProjectTimesheetViewListStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: Array<ProjectTimesheetView> | null;
    statusCode?: HttpStatusCode;
    errors?: any;
};
