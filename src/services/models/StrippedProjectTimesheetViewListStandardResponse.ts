/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { StrippedProjectTimesheetView } from './StrippedProjectTimesheetView';

export type StrippedProjectTimesheetViewListStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: Array<StrippedProjectTimesheetView> | null;
    statusCode?: HttpStatusCode;
    errors?: any;
};
