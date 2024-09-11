/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DashboardPaymentPartnerViewStandardResponse } from '../models/DashboardPaymentPartnerViewStandardResponse';
import type { DashboardProjectManagementViewStandardResponse } from '../models/DashboardProjectManagementViewStandardResponse';
import type { DashboardProjectViewStandardResponse } from '../models/DashboardProjectViewStandardResponse';
import type { SuperAdminDashboardViewStandardResponse } from '../models/SuperAdminDashboardViewStandardResponse';
import type { TeammemberDashboardViewStandardResponse } from '../models/TeammemberDashboardViewStandardResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DashboardService {

    /**
     * @param superAminId 
     * @returns SuperAdminDashboardViewStandardResponse Success
     * @throws ApiError
     */
    public static getAdminMetrics(
superAminId?: string,
): CancelablePromise<SuperAdminDashboardViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Dashboard/admin-metrics',
            query: {
                'superAminId': superAminId,
            },
        });
    }

    /**
     * @param userId 
     * @returns TeammemberDashboardViewStandardResponse Success
     * @throws ApiError
     */
    public static getTeamMemberMetrics(
userId?: string,
): CancelablePromise<TeammemberDashboardViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Dashboard/team-member-metrics',
            query: {
                'userId': userId,
            },
        });
    }

    /**
     * @returns DashboardPaymentPartnerViewStandardResponse Success
     * @throws ApiError
     */
    public static getPayrollManagerMetrics(): CancelablePromise<DashboardPaymentPartnerViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Dashboard/payment-partner-metrics',
        });
    }

    /**
     * @returns DashboardPaymentPartnerViewStandardResponse Success
     * @throws ApiError
     */
    public static getClientMetrics(): CancelablePromise<DashboardPaymentPartnerViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Dashboard/client-metrics',
        });
    }

    /**
     * @returns DashboardPaymentPartnerViewStandardResponse Success
     * @throws ApiError
     */
    public static getSupervisorMetrics(): CancelablePromise<DashboardPaymentPartnerViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Dashboard/supervisor-metrics',
        });
    }

    /**
     * @param superAminId 
     * @returns DashboardProjectManagementViewStandardResponse Success
     * @throws ApiError
     */
    public static getProjectManagementDashboard(
superAminId?: string,
): CancelablePromise<DashboardProjectManagementViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Dashboard/project-management-metrics',
            query: {
                'superAminId': superAminId,
            },
        });
    }

    /**
     * @param projectId 
     * @returns DashboardProjectViewStandardResponse Success
     * @throws ApiError
     */
    public static getProjectDashboard(
projectId?: string,
): CancelablePromise<DashboardProjectViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Dashboard/project-metrics',
            query: {
                'projectId': projectId,
            },
        });
    }

}
