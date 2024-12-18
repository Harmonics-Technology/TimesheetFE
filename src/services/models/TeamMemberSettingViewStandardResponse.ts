/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { TeamMemberSettingView } from './TeamMemberSettingView';

export type TeamMemberSettingViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: TeamMemberSettingView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
