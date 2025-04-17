/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ProjectManagementReportViewStandardResponse } from '../models/ProjectManagementReportViewStandardResponse';
import type { ResourceUtilizationReportViewStandardResponse } from '../models/ResourceUtilizationReportViewStandardResponse';

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

}
