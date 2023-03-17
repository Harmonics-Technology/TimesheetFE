/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ExpenseView } from './ExpenseView';
import type { HttpStatusCode } from './HttpStatusCode';

export type ExpenseViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: ExpenseView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
