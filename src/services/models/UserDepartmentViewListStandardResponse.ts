/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { UserDepartmentView } from './UserDepartmentView';

export type UserDepartmentViewListStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: Array<UserDepartmentView> | null;
    statusCode?: HttpStatusCode;
    errors?: any;
};
