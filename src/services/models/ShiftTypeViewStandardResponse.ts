/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { ShiftTypeView } from './ShiftTypeView';

export type ShiftTypeViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: ShiftTypeView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
