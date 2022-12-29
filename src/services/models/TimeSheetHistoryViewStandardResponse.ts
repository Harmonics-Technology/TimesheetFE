/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { TimeSheetHistoryView } from './TimeSheetHistoryView';

export type TimeSheetHistoryViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: TimeSheetHistoryView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
