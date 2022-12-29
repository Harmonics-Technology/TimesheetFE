/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { TimeSheetHistoryView } from './TimeSheetHistoryView';

export type TimeSheetHistoryViewIEnumerableStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: Array<TimeSheetHistoryView> | null;
    statusCode?: HttpStatusCode;
    errors?: any;
};
