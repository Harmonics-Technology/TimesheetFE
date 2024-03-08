/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CountryView } from './CountryView';
import type { HttpStatusCode } from './HttpStatusCode';

export type CountryViewListStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: Array<CountryView> | null;
    statusCode?: HttpStatusCode;
    errors?: any;
};
