/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { HttpStatusCode } from './HttpStatusCode';
import type { OnboardingFeeModel } from './OnboardingFeeModel';

export type OnboardingFeeModelStandardResponse = {
    href?: string | null;
    relations?: Array<string> | null;
    method?: string | null;
    routeName?: string | null;
    routeValues?: any;
    status?: boolean;
    message?: string | null;
    data?: OnboardingFeeModel;
    statusCode?: HttpStatusCode;
    errors?: any;
};
