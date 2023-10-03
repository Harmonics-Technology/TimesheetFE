/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ControlSettingView } from './ControlSettingView';
import type { HttpStatusCode } from './HttpStatusCode';

export type ControlSettingViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: ControlSettingView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
