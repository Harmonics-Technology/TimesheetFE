/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PayslipUserViewPagedCollectionStandardResponse } from '../models/PayslipUserViewPagedCollectionStandardResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PaySlipService {

    /**
     * @param employeeInformationId 
     * @param offset 
     * @param limit 
     * @param search 
     * @param dateFilter 
     * @returns PayslipUserViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static getTeamMembersPaySlips(
employeeInformationId: string,
offset?: number,
limit?: number,
search?: string,
dateFilter?: string,
): CancelablePromise<PayslipUserViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/PaySlip/team-members/{employeeInformationId}',
            path: {
                'employeeInformationId': employeeInformationId,
            },
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
                'dateFilter': dateFilter,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param search 
     * @param dateFilter 
     * @returns PayslipUserViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static getAllPaySlips(
offset?: number,
limit?: number,
search?: string,
dateFilter?: string,
): CancelablePromise<PayslipUserViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/PaySlip/all',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
                'dateFilter': dateFilter,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }

}
