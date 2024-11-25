/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { ProjectInvoiceView } from './ProjectInvoiceView';

export type ProjectInvoiceViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: ProjectInvoiceView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
