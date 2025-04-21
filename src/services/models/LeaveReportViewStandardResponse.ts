/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { LeaveReportView } from './LeaveReportView';

export type LeaveReportViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: LeaveReportView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
