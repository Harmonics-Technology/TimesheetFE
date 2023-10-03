/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BudgetSummaryReportView } from './BudgetSummaryReportView';
import type { HttpStatusCode } from './HttpStatusCode';

export type BudgetSummaryReportViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: BudgetSummaryReportView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
