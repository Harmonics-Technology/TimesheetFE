/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { FinancialReportView } from './FinancialReportView';
import type { HttpStatusCode } from './HttpStatusCode';

export type FinancialReportViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: FinancialReportView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
