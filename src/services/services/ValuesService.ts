/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ValuesService {

    /**
     * @returns string Success
     * @throws ApiError
     */
    public static getApiValues(): CancelablePromise<Array<string>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Values',
        });
    }

    /**
     * @param requestBody 
     * @returns any Success
     * @throws ApiError
     */
    public static postApiValues(
requestBody?: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Values',
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

    /**
     * @param id 
     * @returns string Success
     * @throws ApiError
     */
    public static getApiValues1(
id: number,
): CancelablePromise<string> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Values/{id}',
            path: {
                'id': id,
            },
        });
    }

    /**
     * @param id 
     * @param requestBody 
     * @returns any Success
     * @throws ApiError
     */
    public static putApiValues(
id: number,
requestBody?: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/Values/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

    /**
     * @param id 
     * @returns any Success
     * @throws ApiError
     */
    public static deleteApiValues(
id: number,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/Values/{id}',
            path: {
                'id': id,
            },
        });
    }

}
