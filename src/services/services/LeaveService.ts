/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanStandardResponse } from '../models/BooleanStandardResponse';
import type { LeaveModel } from '../models/LeaveModel';
import type { LeaveStatuses } from '../models/LeaveStatuses';
import type { LeaveTypeModel } from '../models/LeaveTypeModel';
import type { LeaveTypeViewPagedCollectionStandardResponse } from '../models/LeaveTypeViewPagedCollectionStandardResponse';
import type { LeaveTypeViewStandardResponse } from '../models/LeaveTypeViewStandardResponse';
import type { LeaveViewPagedCollectionStandardResponse } from '../models/LeaveViewPagedCollectionStandardResponse';
import type { LeaveViewStandardResponse } from '../models/LeaveViewStandardResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class LeaveService {

    /**
     * @param requestBody 
     * @returns LeaveTypeViewStandardResponse Success
     * @throws ApiError
     */
    public static addLeaveType(
requestBody?: LeaveTypeModel,
): CancelablePromise<LeaveTypeViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Leave/leave-type',
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
     * @param requestBody 
     * @returns LeaveTypeViewStandardResponse Success
     * @throws ApiError
     */
    public static updateLeaveType(
id?: string,
requestBody?: LeaveTypeModel,
): CancelablePromise<LeaveTypeViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Leave/leave-type/update',
            query: {
                'id': id,
            },
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
    public static deleteLeaveType(
id?: string,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Leave/leave-type/delete',
            query: {
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
     * @returns LeaveTypeViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static leaveTypes(
offset?: number,
limit?: number,
): CancelablePromise<LeaveTypeViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Leave/leave-types',
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
     * @param offset 
     * @param limit 
     * @param supervisorId 
     * @param employeeInformationId 
     * @param search 
     * @param startDate 
     * @param endDate 
     * @returns LeaveViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listLeaves(
offset?: number,
limit?: number,
supervisorId?: string,
employeeInformationId?: string,
search?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<LeaveViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Leave/leaves',
            query: {
                'Offset': offset,
                'Limit': limit,
                'supervisorId': supervisorId,
                'employeeInformationId': employeeInformationId,
                'search': search,
                'StartDate': startDate,
                'EndDate': endDate,
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
     * @returns LeaveViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listAllPendingLeaves(
offset?: number,
limit?: number,
): CancelablePromise<LeaveViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Leave/treated-leaves',
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
     * @param requestBody 
     * @returns LeaveViewStandardResponse Success
     * @throws ApiError
     */
    public static createLeave(
requestBody?: LeaveModel,
): CancelablePromise<LeaveViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Leave/leave',
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
     * @param status 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static treatLeave(
id?: string,
status?: LeaveStatuses,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Leave/leave/treat',
            query: {
                'id': id,
                'status': status,
            },
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
    public static deleteLeave(
id?: string,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Leave/leave/delete',
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
