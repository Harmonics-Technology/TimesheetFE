/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { ProjectTimesheetListView } from './ProjectTimesheetListView';

export type ProjectTimesheetListViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: ProjectTimesheetListView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
