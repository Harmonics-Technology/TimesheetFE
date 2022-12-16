/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExpenseModel } from '../models/ExpenseModel';
import type { ExpenseViewPagedCollectionStandardResponse } from '../models/ExpenseViewPagedCollectionStandardResponse';
import type { ExpenseViewStandardResponse } from '../models/ExpenseViewStandardResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FinancialService {

    /**
     * @param requestBody 
     * @returns ExpenseViewStandardResponse Success
     * @throws ApiError
     */
    public static addExpense(
requestBody?: ExpenseModel,
): CancelablePromise<ExpenseViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Financial/expense',
            body: requestBody,
            mediaType: 'application/json-patch+json',
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param search 
     * @returns ExpenseViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listExpenses(
offset?: number,
limit?: number,
search?: string,
): CancelablePromise<ExpenseViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/expenses',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param expenseId 
     * @returns ExpenseViewStandardResponse Success
     * @throws ApiError
     */
    public static approveExpense(
expenseId: string,
): CancelablePromise<ExpenseViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Financial/expense/{expenseId}/approve',
            path: {
                'expenseId': expenseId,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param expenseId 
     * @returns ExpenseViewStandardResponse Success
     * @throws ApiError
     */
    public static declineExpense(
expenseId: string,
): CancelablePromise<ExpenseViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Financial/expense/{expenseId}/decline',
            path: {
                'expenseId': expenseId,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

}
