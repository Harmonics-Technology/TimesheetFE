/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DashboardViewStandardResponse } from '../models/DashboardViewStandardResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class DashboardService {

    /**
     * @returns DashboardViewStandardResponse Success
     * @throws ApiError
     */
    public static getAdminMetrics(): CancelablePromise<DashboardViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Dashboard/admin-metrics',
        });
    }

}
