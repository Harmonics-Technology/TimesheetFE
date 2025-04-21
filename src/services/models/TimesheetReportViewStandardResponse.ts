/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { TimesheetReportView } from './TimesheetReportView';

export type TimesheetReportViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: TimesheetReportView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
