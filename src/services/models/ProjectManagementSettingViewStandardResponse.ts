/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { ProjectManagementSettingView } from './ProjectManagementSettingView';

export type ProjectManagementSettingViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: ProjectManagementSettingView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
