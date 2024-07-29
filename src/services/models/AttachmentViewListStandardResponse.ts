/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AttachmentView } from './AttachmentView';
import type { HttpStatusCode } from './HttpStatusCode';

export type AttachmentViewListStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: Array<AttachmentView> | null;
    statusCode?: HttpStatusCode;
    errors?: any;
};
