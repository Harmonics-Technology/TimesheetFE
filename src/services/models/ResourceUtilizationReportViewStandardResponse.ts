/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { ResourceUtilizationReportView } from './ResourceUtilizationReportView';

export type ResourceUtilizationReportViewStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: ResourceUtilizationReportView;
    statusCode?: HttpStatusCode;
    errors?: any;
};
