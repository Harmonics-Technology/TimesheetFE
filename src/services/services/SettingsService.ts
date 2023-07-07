/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExpenseTypeViewIEnumerableStandardResponse } from '../models/ExpenseTypeViewIEnumerableStandardResponse';
import type { ExpenseTypeViewStandardResponse } from '../models/ExpenseTypeViewStandardResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SettingsService {

    /**
     * @param name 
     * @param superAdminId 
     * @returns ExpenseTypeViewStandardResponse Success
     * @throws ApiError
     */
    public static createExpenseType(
name: string,
superAdminId?: string,
): CancelablePromise<ExpenseTypeViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Settings/expense-type/create/{name}',
            path: {
                'name': name,
            },
            query: {
                'superAdminId': superAdminId,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param superAdminId 
     * @returns ExpenseTypeViewIEnumerableStandardResponse Success
     * @throws ApiError
     */
    public static listExpenseTypes(
superAdminId?: string,
): CancelablePromise<ExpenseTypeViewIEnumerableStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Settings/expense-types',
            query: {
                'superAdminId': superAdminId,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param expenseTypeId 
     * @returns ExpenseTypeViewStandardResponse Success
     * @throws ApiError
     */
    public static toggleStatus(
expenseTypeId: string,
): CancelablePromise<ExpenseTypeViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Settings/expense-type/status/{expenseTypeId}',
            path: {
                'expenseTypeId': expenseTypeId,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

}
