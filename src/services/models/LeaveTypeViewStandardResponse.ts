/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { LeaveTypeView } from './LeaveTypeView';

export type LeaveTypeViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: LeaveTypeView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
