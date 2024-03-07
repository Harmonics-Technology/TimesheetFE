/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DepartmentView } from './DepartmentView';
import type { HttpStatusCode } from './HttpStatusCode';

export type DepartmentViewIEnumerableStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: Array<DepartmentView> | null;
    statusCode?: HttpStatusCode;
    errors?: any;
};
