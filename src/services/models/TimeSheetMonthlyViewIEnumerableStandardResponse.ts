/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { TimeSheetMonthlyView } from './TimeSheetMonthlyView';

export type TimeSheetMonthlyViewIEnumerableStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: Array<TimeSheetMonthlyView> | null;
    statusCode?: HttpStatusCode;
    errors?: any;
};
