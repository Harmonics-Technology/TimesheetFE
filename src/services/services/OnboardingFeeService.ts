/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanStandardResponse } from '../models/BooleanStandardResponse';
import type { OnboardingFeeModel } from '../models/OnboardingFeeModel';
import type { OnboardingFeeModelStandardResponse } from '../models/OnboardingFeeModelStandardResponse';
import type { OnboardingFeeViewPagedCollectionStandardResponse } from '../models/OnboardingFeeViewPagedCollectionStandardResponse';
import type { OnboardingFeeViewStandardResponse } from '../models/OnboardingFeeViewStandardResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class OnboardingFeeService {

    /**
     * @param requestBody 
     * @returns OnboardingFeeModelStandardResponse Success
     * @throws ApiError
     */
    public static addFee(
requestBody?: OnboardingFeeModel,
): CancelablePromise<OnboardingFeeModelStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/OnboardingFee/fee',
            body: requestBody,
            mediaType: 'application/json-patch+json',
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param feeId 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static deleteFee(
feeId: string,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/OnboardingFee/delete/{feeId}',
            path: {
                'feeId': feeId,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @returns OnboardingFeeViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listPercentageOnboardingFees(
offset?: number,
limit?: number,
): CancelablePromise<OnboardingFeeViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/OnboardingFee/percentage-fees',
            query: {
                'Offset': offset,
                'Limit': limit,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @returns OnboardingFeeViewStandardResponse Success
     * @throws ApiError
     */
    public static getFixedAmount(): CancelablePromise<OnboardingFeeViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/OnboardingFee/fixed-fee',
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @returns OnboardingFeeViewStandardResponse Success
     * @throws ApiError
     */
    public static getHst(): CancelablePromise<OnboardingFeeViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/OnboardingFee/hst',
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

}
