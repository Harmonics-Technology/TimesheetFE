/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CommandCenterAddCardResponse } from './CommandCenterAddCardResponse';
import type { HttpStatusCode } from './HttpStatusCode';

export type CommandCenterAddCardResponseStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: CommandCenterAddCardResponse;
    statusCode?: HttpStatusCode;
    errors?: any;
};
