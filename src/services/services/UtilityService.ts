/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanStandardResponse } from '../models/BooleanStandardResponse';
import type { ContactMessageModel } from '../models/ContactMessageModel';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UtilityService {

    /**
     * @param requestBody 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static sendContactMessage(
requestBody?: ContactMessageModel,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Utility/contact-us',
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

}
