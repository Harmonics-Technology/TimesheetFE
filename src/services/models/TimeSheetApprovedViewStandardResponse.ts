/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { TimeSheetApprovedView } from './TimeSheetApprovedView';

export type TimeSheetApprovedViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: TimeSheetApprovedView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
