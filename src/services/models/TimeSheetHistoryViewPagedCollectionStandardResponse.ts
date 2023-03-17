/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { TimeSheetHistoryViewPagedCollection } from './TimeSheetHistoryViewPagedCollection';

export type TimeSheetHistoryViewPagedCollectionStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: TimeSheetHistoryViewPagedCollection;
    statusCode?: HttpStatusCode;
    errors?: any;
};
