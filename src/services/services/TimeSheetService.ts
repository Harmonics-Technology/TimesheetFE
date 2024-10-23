/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanStandardResponse } from '../models/BooleanStandardResponse';
import type { RejectTimesheetModel } from '../models/RejectTimesheetModel';
import type { TimeSheetApprovedViewPagedCollectionStandardResponse } from '../models/TimeSheetApprovedViewPagedCollectionStandardResponse';
import type { TimesheetFilterByUserPayrollType } from '../models/TimesheetFilterByUserPayrollType';
import type { TimeSheetHistoryViewPagedCollectionStandardResponse } from '../models/TimeSheetHistoryViewPagedCollectionStandardResponse';
import type { TimesheetHoursAdditionModel } from '../models/TimesheetHoursAdditionModel';
import type { TimesheetHoursApprovalModel } from '../models/TimesheetHoursApprovalModel';
import type { TimeSheetMonthlyViewIEnumerableStandardResponse } from '../models/TimeSheetMonthlyViewIEnumerableStandardResponse';
import type { TimeSheetMonthlyViewStandardResponse } from '../models/TimeSheetMonthlyViewStandardResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class TimeSheetService {

    /**
     * @param offset 
     * @param limit 
     * @param superAdminId 
     * @param clientId 
     * @param search 
     * @param startDate 
     * @param endDate 
     * @param userFilter 
     * @returns TimeSheetHistoryViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listTimeSheetHistories(
offset?: number,
limit?: number,
superAdminId?: string,
clientId?: string,
search?: string,
startDate?: string,
endDate?: string,
userFilter?: TimesheetFilterByUserPayrollType,
): CancelablePromise<TimeSheetHistoryViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/TimeSheet/history',
            query: {
                'Offset': offset,
                'Limit': limit,
                'superAdminId': superAdminId,
                'clientId': clientId,
                'search': search,
                'StartDate': startDate,
                'EndDate': endDate,
                'userFilter': userFilter,
            },
        });
    }

    /**
     * @param employeeInformationId 
     * @param date 
     * @param endDate 
     * @returns TimeSheetMonthlyViewStandardResponse Success
     * @throws ApiError
     */
    public static getTimeSheet(
employeeInformationId?: string,
date?: string,
endDate?: string,
): CancelablePromise<TimeSheetMonthlyViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/TimeSheet/monthly',
            query: {
                'employeeInformationId': employeeInformationId,
                'date': date,
                'endDate': endDate,
            },
        });
    }

    /**
     * @param employeeInformationId 
     * @param startDate 
     * @param endDate 
     * @returns TimeSheetMonthlyViewStandardResponse Success
     * @throws ApiError
     */
    public static getTimesheetByPaySchedule(
employeeInformationId?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<TimeSheetMonthlyViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/TimeSheet/schedule',
            query: {
                'employeeInformationId': employeeInformationId,
                'startDate': startDate,
                'endDate': endDate,
            },
        });
    }

    /**
     * @param employeeInformationId 
     * @param date 
     * @returns TimeSheetMonthlyViewIEnumerableStandardResponse Success
     * @throws ApiError
     */
    public static getTimeSheet2(
employeeInformationId?: string,
date?: string,
): CancelablePromise<TimeSheetMonthlyViewIEnumerableStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/TimeSheet/monthly2',
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
     * @param requestBody 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static approveTimeSheetForADay(
employeeInformationId?: string,
date?: string,
requestBody?: Array<TimesheetHoursApprovalModel>,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/TimeSheet/approve/daily',
            query: {
                'employeeInformationId': employeeInformationId,
                'date': date,
            },
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

    /**
     * @param employeeInformationId 
     * @param date 
     * @param requestBody 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static addWorkHoursForADay(
employeeInformationId?: string,
date?: string,
requestBody?: Array<TimesheetHoursAdditionModel>,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/TimeSheet/add-hour',
            query: {
                'employeeInformationId': employeeInformationId,
                'date': date,
            },
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param superAdminId 
     * @param clientId 
     * @param search 
     * @param userFilter 
     * @returns TimeSheetApprovedViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listApprovedTimeSheet(
offset?: number,
limit?: number,
superAdminId?: string,
clientId?: string,
search?: string,
userFilter?: TimesheetFilterByUserPayrollType,
): CancelablePromise<TimeSheetApprovedViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/TimeSheet/approved',
            query: {
                'Offset': offset,
                'Limit': limit,
                'superAdminId': superAdminId,
                'clientId': clientId,
                'search': search,
                'userFilter': userFilter,
            },
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param employeeInformationId 
     * @returns TimeSheetApprovedViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listTeamMemberApprovedTimeSheet(
offset?: number,
limit?: number,
employeeInformationId?: string,
): CancelablePromise<TimeSheetApprovedViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/TimeSheet/team-member/approved',
            query: {
                'Offset': offset,
                'Limit': limit,
                'employeeInformationId': employeeInformationId,
            },
        });
    }

    /**
     * @param employeeInformationId 
     * @param date 
     * @param requestBody 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static rejectTimeSheetForADay(
employeeInformationId?: string,
date?: string,
requestBody?: RejectTimesheetModel,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/TimeSheet/reject',
            query: {
                'employeeInformationId': employeeInformationId,
                'date': date,
            },
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

    /**
     * @param employeeInformationId 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static generatePayroll(
employeeInformationId?: string,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/TimeSheet/generate-payroll',
            query: {
                'employeeInformationId': employeeInformationId,
            },
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @returns TimeSheetHistoryViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static getTeamMemberTimeSheetHistory(
offset?: number,
limit?: number,
): CancelablePromise<TimeSheetHistoryViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/TimeSheet/team-member/history',
            query: {
                'Offset': offset,
                'Limit': limit,
            },
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param employeeInformationId 
     * @param startDate 
     * @param endDate 
     * @returns TimeSheetHistoryViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static getTeamMemberRecentTimeSheet(
offset?: number,
limit?: number,
employeeInformationId?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<TimeSheetHistoryViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/TimeSheet/team-member/recent-timesheet',
            query: {
                'Offset': offset,
                'Limit': limit,
                'employeeInformationId': employeeInformationId,
                'StartDate': startDate,
                'EndDate': endDate,
            },
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param search 
     * @param startDate 
     * @param endDate 
     * @param userFilter 
     * @returns TimeSheetHistoryViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static getSuperviseesTimeSheet(
offset?: number,
limit?: number,
search?: string,
startDate?: string,
endDate?: string,
userFilter?: TimesheetFilterByUserPayrollType,
): CancelablePromise<TimeSheetHistoryViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/TimeSheet/supervisees-timesheets',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
                'StartDate': startDate,
                'EndDate': endDate,
                'userFilter': userFilter,
            },
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param search 
     * @param startDate 
     * @param endDate 
     * @param userFilter 
     * @returns TimeSheetApprovedViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static getSuperviseesApprovedTimeSheet(
offset?: number,
limit?: number,
search?: string,
startDate?: string,
endDate?: string,
userFilter?: TimesheetFilterByUserPayrollType,
): CancelablePromise<TimeSheetApprovedViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/TimeSheet/supervisees-approved-timesheets',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
                'StartDate': startDate,
                'EndDate': endDate,
                'userFilter': userFilter,
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
    public static getApprovedClientTeamMemberSheet(
offset?: number,
limit?: number,
search?: string,
): CancelablePromise<TimeSheetApprovedViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/TimeSheet/client/team-members/approved',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
            },
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param search 
     * @param startDate 
     * @param endDate 
     * @returns TimeSheetHistoryViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static getClientTimeSheetHistory(
offset?: number,
limit?: number,
search?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<TimeSheetHistoryViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/TimeSheet/client/team-members/history',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
                'StartDate': startDate,
                'EndDate': endDate,
            },
        });
    }

    /**
     * @param date 
     * @param employeeInformationId 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static createTimeSheetForADay(
date?: string,
employeeInformationId?: string,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/TimeSheet/create-timesheet-for-a-day',
            query: {
                'date': date,
                'employeeInformationId': employeeInformationId,
            },
        });
    }

}
