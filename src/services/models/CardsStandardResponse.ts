/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Cards } from './Cards';
import type { HttpStatusCode } from './HttpStatusCode';

export type CardsStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: Cards;
    statusCode?: HttpStatusCode;
    errors?: any;
};
