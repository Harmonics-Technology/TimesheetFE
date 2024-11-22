/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { ProjectInvoiceRecipientView } from './ProjectInvoiceRecipientView';

export type ProjectInvoiceRecipientViewListStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: Array<ProjectInvoiceRecipientView> | null;
    statusCode?: HttpStatusCode;
    errors?: any;
};
