/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { PaymentPartnerSettingView } from './PaymentPartnerSettingView';

export type PaymentPartnerSettingViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: PaymentPartnerSettingView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
