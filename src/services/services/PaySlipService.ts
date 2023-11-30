/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PaySlipViewPagedCollectionStandardResponse } from '../models/PaySlipViewPagedCollectionStandardResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PaySlipService {

    /**
     * @param employeeInformationId 
     * @param offset 
     * @param limit 
     * @param search 
     * @param startDate 
     * @param endDate 
     * @param payrollTypeFilter 
     * @returns PaySlipViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static getTeamMembersPaySlips(
employeeInformationId: string,
offset?: number,
limit?: number,
search?: string,
startDate?: string,
endDate?: string,
payrollTypeFilter?: number,
): CancelablePromise<PaySlipViewPagedCollectionStandardResponse> {
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
                'StartDate': startDate,
                'EndDate': endDate,
                'payrollTypeFilter': payrollTypeFilter,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param superAdminId 
     * @param search 
     * @param startDate 
     * @param endDate 
     * @param payrollTypeFilter 
     * @returns PaySlipViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static getAllPaySlips(
offset?: number,
limit?: number,
superAdminId?: string,
search?: string,
startDate?: string,
endDate?: string,
payrollTypeFilter?: number,
): CancelablePromise<PaySlipViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/PaySlip/all',
            query: {
                'Offset': offset,
                'Limit': limit,
                'superAdminId': superAdminId,
                'search': search,
                'StartDate': startDate,
                'EndDate': endDate,
                'payrollTypeFilter': payrollTypeFilter,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }

}
