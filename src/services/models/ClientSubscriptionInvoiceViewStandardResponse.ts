/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ClientSubscriptionInvoiceView } from './ClientSubscriptionInvoiceView';
import type { HttpStatusCode } from './HttpStatusCode';

export type ClientSubscriptionInvoiceViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: ClientSubscriptionInvoiceView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
