/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ClientSubscriptionResponseViewModel } from './ClientSubscriptionResponseViewModel';
import type { HttpStatusCode } from './HttpStatusCode';

export type ClientSubscriptionResponseViewModelStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: ClientSubscriptionResponseViewModel;
    statusCode?: HttpStatusCode;
    errors?: any;
};
