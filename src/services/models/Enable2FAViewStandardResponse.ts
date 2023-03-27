/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Enable2FAView } from './Enable2FAView';
import type { HttpStatusCode } from './HttpStatusCode';

export type Enable2FAViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: Enable2FAView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
