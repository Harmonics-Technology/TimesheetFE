/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { TimeSheetMonthlyView } from './TimeSheetMonthlyView';

export type TimeSheetMonthlyViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: TimeSheetMonthlyView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
