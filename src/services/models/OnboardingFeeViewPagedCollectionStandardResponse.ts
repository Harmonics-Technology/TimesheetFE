/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { OnboardingFeeViewPagedCollection } from './OnboardingFeeViewPagedCollection';

export type OnboardingFeeViewPagedCollectionStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: OnboardingFeeViewPagedCollection;
    statusCode?: HttpStatusCode;
    errors?: any;
};
