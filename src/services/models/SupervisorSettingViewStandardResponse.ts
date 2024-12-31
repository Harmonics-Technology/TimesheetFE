/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { SupervisorSettingView } from './SupervisorSettingView';

export type SupervisorSettingViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: SupervisorSettingView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
