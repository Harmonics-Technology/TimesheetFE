/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { OperationalTaskReportView } from './OperationalTaskReportView';

export type OperationalTaskReportViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: OperationalTaskReportView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
