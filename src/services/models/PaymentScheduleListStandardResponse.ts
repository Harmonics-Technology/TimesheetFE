/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { PaymentSchedule } from './PaymentSchedule';

export type PaymentScheduleListStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: Array<PaymentSchedule> | null;
    statusCode?: HttpStatusCode;
    errors?: any;
};
