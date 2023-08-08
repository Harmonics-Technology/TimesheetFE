/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { SubscriptionHistoryViewModel } from './SubscriptionHistoryViewModel';

export type SubscriptionHistoryViewModelStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: SubscriptionHistoryViewModel;
    statusCode?: HttpStatusCode;
    errors?: any;
};
