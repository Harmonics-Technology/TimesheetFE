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
     * @returns ExpenseTypeViewStandardResponse Success
     * @throws ApiError
     */
    public static createExpenseType(
name: string,
): CancelablePromise<ExpenseTypeViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Settings/expense-type/create/{name}',
            path: {
                'name': name,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @returns ExpenseTypeViewIEnumerableStandardResponse Success
     * @throws ApiError
     */
    public static listExpenseTypes(): CancelablePromise<ExpenseTypeViewIEnumerableStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Settings/expense-types',
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
