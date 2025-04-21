/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FinancialReportViewStandardResponse } from '../models/FinancialReportViewStandardResponse';
import type { LeaveReportViewStandardResponse } from '../models/LeaveReportViewStandardResponse';
import type { OperationalTaskReportViewStandardResponse } from '../models/OperationalTaskReportViewStandardResponse';
import type { ProjectManagementReportViewStandardResponse } from '../models/ProjectManagementReportViewStandardResponse';
import type { ResourceUtilizationReportViewStandardResponse } from '../models/ResourceUtilizationReportViewStandardResponse';
import type { TimesheetReportViewStandardResponse } from '../models/TimesheetReportViewStandardResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ReportService {

    /**
     * @param superAminId 
     * @returns ProjectManagementReportViewStandardResponse Success
     * @throws ApiError
     */
    public static getProjectManagementReport(
superAminId?: string,
): CancelablePromise<ProjectManagementReportViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Report/project-management',
            query: {
                'superAminId': superAminId,
            },
        });
    }

    /**
     * @param superAminId 
     * @returns ResourceUtilizationReportViewStandardResponse Success
     * @throws ApiError
     */
    public static getResourceUtilizationReport(
superAminId?: string,
): CancelablePromise<ResourceUtilizationReportViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Report/resource-utilization',
            query: {
                'superAminId': superAminId,
            },
        });
    }

    /**
     * @param superAminId 
     * @returns LeaveReportViewStandardResponse Success
     * @throws ApiError
     */
    public static getLeaveReport(
superAminId?: string,
): CancelablePromise<LeaveReportViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Report/leave',
            query: {
                'superAminId': superAminId,
            },
        });
    }

    /**
     * @param superAminId 
     * @returns OperationalTaskReportViewStandardResponse Success
     * @throws ApiError
     */
    public static getOperationalTaskReport(
superAminId?: string,
): CancelablePromise<OperationalTaskReportViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Report/operational-tasks',
            query: {
                'superAminId': superAminId,
            },
        });
    }

    /**
     * @param superAminId 
     * @returns TimesheetReportViewStandardResponse Success
     * @throws ApiError
     */
    public static getTimesheetReport(
superAminId?: string,
): CancelablePromise<TimesheetReportViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Report/timesheet',
            query: {
                'superAminId': superAminId,
            },
        });
    }

    /**
     * @param superAminId 
     * @returns FinancialReportViewStandardResponse Success
     * @throws ApiError
     */
    public static getFinancialReportView(
superAminId?: string,
): CancelablePromise<FinancialReportViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Report/financial',
            query: {
                'superAminId': superAminId,
            },
        });
    }

}
