/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ExpenseTypeView } from './ExpenseTypeView';
import type { HttpStatusCode } from './HttpStatusCode';

export type ExpenseTypeViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: ExpenseTypeView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
