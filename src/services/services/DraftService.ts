/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanStandardResponse } from '../models/BooleanStandardResponse';
import type { UserDraftModel } from '../models/UserDraftModel';
import type { UserDraftViewPagedCollectionStandardResponse } from '../models/UserDraftViewPagedCollectionStandardResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DraftService {

    /**
     * @param requestBody 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static createDraft(
requestBody?: UserDraftModel,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Draft/save-user-draft',
            body: requestBody,
            mediaType: 'application/json-patch+json',
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param superAdminId 
     * @param role 
     * @returns UserDraftViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listDrafts(
offset?: number,
limit?: number,
superAdminId?: string,
role?: string,
): CancelablePromise<UserDraftViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Draft/user-drafts',
            query: {
                'Offset': offset,
                'Limit': limit,
                'superAdminId': superAdminId,
                'role': role,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static updateDraft(
requestBody?: UserDraftModel,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Draft/update-user-draft',
            body: requestBody,
            mediaType: 'application/json-patch+json',
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param id 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static deleteDraft(
id?: string,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Draft/delete-user-draft',
            query: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

}
