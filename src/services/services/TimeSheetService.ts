/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanStandardResponse } from '../models/BooleanStandardResponse';
import type { TimeSheetApprovedViewPagedCollectionStandardResponse } from '../models/TimeSheetApprovedViewPagedCollectionStandardResponse';
import type { TimeSheetHistoryViewPagedCollectionStandardResponse } from '../models/TimeSheetHistoryViewPagedCollectionStandardResponse';
import type { TimeSheetMonthlyViewIEnumerableStandardResponse } from '../models/TimeSheetMonthlyViewIEnumerableStandardResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class TimeSheetService {

    /**
     * @param offset 
     * @param limit 
     * @param search 
     * @returns TimeSheetHistoryViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listTimeSheetHistories(
offset?: number,
limit?: number,
search?: string,
): CancelablePromise<TimeSheetHistoryViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/TimeSheet/history',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
            },
        });
    }

    /**
     * @param employeeInformationId 
     * @param date 
     * @returns TimeSheetMonthlyViewIEnumerableStandardResponse Success
     * @throws ApiError
     */
    public static getTimeSheet(
employeeInformationId?: string,
date?: string,
): CancelablePromise<TimeSheetMonthlyViewIEnumerableStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/TimeSheet/monthly',
            query: {
                'employeeInformationId': employeeInformationId,
                'date': date,
            },
        });
    }

    /**
     * @param employeeInformationId 
     * @param date 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static approveTimeSheetForAWholeMonth(
employeeInformationId?: string,
date?: string,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/TimeSheet/approve/monthly',
            query: {
                'employeeInformationId': employeeInformationId,
                'date': date,
            },
        });
    }

    /**
     * @param employeeInformationId 
     * @param date 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static approveTimeSheetForADay(
employeeInformationId?: string,
date?: string,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/TimeSheet/approve/daily',
            query: {
                'employeeInformationId': employeeInformationId,
                'date': date,
            },
        });
    }

    /**
     * @param employeeInformationId 
     * @param date 
     * @param hours 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static addWorkHoursForADay(
employeeInformationId?: string,
date?: string,
hours?: number,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/TimeSheet/add-hour',
            query: {
                'employeeInformationId': employeeInformationId,
                'date': date,
                'hours': hours,
            },
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param search 
     * @returns TimeSheetApprovedViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listApprovedTimeSheet(
offset?: number,
limit?: number,
search?: string,
): CancelablePromise<TimeSheetApprovedViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/TimeSheet/approved',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
            },
        });
    }

}
