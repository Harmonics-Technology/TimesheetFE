/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContractModel } from '../models/ContractModel';
import type { ContractViewPagedCollectionStandardResponse } from '../models/ContractViewPagedCollectionStandardResponse';
import type { ContractViewStandardResponse } from '../models/ContractViewStandardResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ContractService {

    /**
     * @param requestBody 
     * @returns ContractViewStandardResponse Success
     * @throws ApiError
     */
    public static createContract(
requestBody?: ContractModel,
): CancelablePromise<ContractViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Contract/create',
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
     * @returns ContractViewStandardResponse Success
     * @throws ApiError
     */
    public static getContract(
id: string,
): CancelablePromise<ContractViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Contract/get/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns ContractViewStandardResponse Success
     * @throws ApiError
     */
    public static updateContract(
requestBody?: ContractModel,
): CancelablePromise<ContractViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/Contract/update',
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
     * @returns ContractViewStandardResponse Success
     * @throws ApiError
     */
    public static terminateContract(
id: string,
): CancelablePromise<ContractViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/Contract/terminate/{id}',
            path: {
                'id': id,
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
     * @param search 
     * @returns ContractViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listContracts(
offset?: number,
limit?: number,
search?: string,
): CancelablePromise<ContractViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Contract/list',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

}
