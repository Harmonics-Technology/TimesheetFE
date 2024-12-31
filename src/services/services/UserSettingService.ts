/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminSettingModel } from '../models/AdminSettingModel';
import type { AdminSettingViewStandardResponse } from '../models/AdminSettingViewStandardResponse';
import type { BooleanStandardResponse } from '../models/BooleanStandardResponse';
import type { PaymentPartnerSettingModel } from '../models/PaymentPartnerSettingModel';
import type { PaymentPartnerSettingViewStandardResponse } from '../models/PaymentPartnerSettingViewStandardResponse';
import type { PayrollManagerSettingModel } from '../models/PayrollManagerSettingModel';
import type { PayrollManagerSettingViewStandardResponse } from '../models/PayrollManagerSettingViewStandardResponse';
import type { SupervisorSettingModel } from '../models/SupervisorSettingModel';
import type { SupervisorSettingViewStandardResponse } from '../models/SupervisorSettingViewStandardResponse';
import type { TeamMemberSettingModel } from '../models/TeamMemberSettingModel';
import type { TeamMemberSettingViewStandardResponse } from '../models/TeamMemberSettingViewStandardResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UserSettingService {

    /**
     * @param userId 
     * @returns AdminSettingViewStandardResponse Success
     * @throws ApiError
     */
    public static getAdminSettingById(
userId?: string,
): CancelablePromise<AdminSettingViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/UserSetting/admin-setting',
            query: {
                'userId': userId,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static updateAdminSettings(
requestBody?: AdminSettingModel,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/UserSetting/update-admin-setting',
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

    /**
     * @param userId 
     * @returns PaymentPartnerSettingViewStandardResponse Success
     * @throws ApiError
     */
    public static getPaymentPartnerSettingById(
userId?: string,
): CancelablePromise<PaymentPartnerSettingViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/UserSetting/payment-partner-setting',
            query: {
                'userId': userId,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static updatePaymentPartnerSettings(
requestBody?: PaymentPartnerSettingModel,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/UserSetting/update-payment-partner-setting',
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

    /**
     * @param userId 
     * @returns PayrollManagerSettingViewStandardResponse Success
     * @throws ApiError
     */
    public static getPayrollManagerSettingById(
userId?: string,
): CancelablePromise<PayrollManagerSettingViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/UserSetting/payroll-manager-setting',
            query: {
                'userId': userId,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static updatePayrollManagerSettings(
requestBody?: PayrollManagerSettingModel,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/UserSetting/update-payroll-manager-setting',
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

    /**
     * @param userId 
     * @returns SupervisorSettingViewStandardResponse Success
     * @throws ApiError
     */
    public static getSupervisorSettingById(
userId?: string,
): CancelablePromise<SupervisorSettingViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/UserSetting/supervisor-setting',
            query: {
                'userId': userId,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static updateSupervisorSettings(
requestBody?: SupervisorSettingModel,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/UserSetting/update-supervisor-setting',
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

    /**
     * @param userId 
     * @returns TeamMemberSettingViewStandardResponse Success
     * @throws ApiError
     */
    public static getTeamMemberSettingById(
userId?: string,
): CancelablePromise<TeamMemberSettingViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/UserSetting/team-member-setting',
            query: {
                'userId': userId,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static updateTeamMemberSettings(
requestBody?: TeamMemberSettingModel,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/UserSetting/update-team-member-setting',
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

}
