/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AdminSettingView } from './AdminSettingView';
import type { HttpStatusCode } from './HttpStatusCode';

export type AdminSettingViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: AdminSettingView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
