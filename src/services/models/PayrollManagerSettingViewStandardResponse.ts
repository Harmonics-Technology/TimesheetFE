/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { PayrollManagerSettingView } from './PayrollManagerSettingView';

export type PayrollManagerSettingViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: PayrollManagerSettingView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
