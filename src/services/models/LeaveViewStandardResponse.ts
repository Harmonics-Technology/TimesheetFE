/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { LeaveView } from './LeaveView';

export type LeaveViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: LeaveView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
