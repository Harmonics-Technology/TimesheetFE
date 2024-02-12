/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ClientSubscriptionDetailView } from './ClientSubscriptionDetailView';
import type { HttpStatusCode } from './HttpStatusCode';

export type ClientSubscriptionDetailViewListStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: Array<ClientSubscriptionDetailView> | null;
    statusCode?: HttpStatusCode;
    errors?: any;
};
