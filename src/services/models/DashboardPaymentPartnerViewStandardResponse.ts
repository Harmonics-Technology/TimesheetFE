/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DashboardPaymentPartnerView } from './DashboardPaymentPartnerView';
import type { HttpStatusCode } from './HttpStatusCode';

export type DashboardPaymentPartnerViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: DashboardPaymentPartnerView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
