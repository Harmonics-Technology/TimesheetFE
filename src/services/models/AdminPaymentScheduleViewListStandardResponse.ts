/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AdminPaymentScheduleView } from './AdminPaymentScheduleView';
import type { HttpStatusCode } from './HttpStatusCode';

export type AdminPaymentScheduleViewListStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: Array<AdminPaymentScheduleView> | null;
    statusCode?: HttpStatusCode;
    errors?: any;
};
