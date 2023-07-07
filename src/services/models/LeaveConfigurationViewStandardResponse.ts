/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { LeaveConfigurationView } from './LeaveConfigurationView';

export type LeaveConfigurationViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: LeaveConfigurationView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
