/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BooleanStandardResponse } from '../models/BooleanStandardResponse';
import type { ShiftModel } from '../models/ShiftModel';
import type { ShiftViewListStandardResponse } from '../models/ShiftViewListStandardResponse';
import type { ShiftViewStandardResponse } from '../models/ShiftViewStandardResponse';
import type { SwapViewPagedCollectionStandardResponse } from '../models/SwapViewPagedCollectionStandardResponse';
import type { UsersShiftViewPagedCollectionStandardResponse } from '../models/UsersShiftViewPagedCollectionStandardResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ShiftService {

    /**
     * @param requestBody 
     * @returns ShiftViewStandardResponse Success
     * @throws ApiError
     */
    public static addShift(
requestBody?: ShiftModel,
): CancelablePromise<ShiftViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Shift/add-shift',
            body: requestBody,
            mediaType: 'application/json-patch+json',
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param startDate 
     * @param endDate 
     * @param userId 
     * @param isPublished 
     * @returns ShiftViewListStandardResponse Success
     * @throws ApiError
     */
    public static listUsersShift(
startDate?: string,
endDate?: string,
userId?: string,
isPublished?: boolean,
): CancelablePromise<ShiftViewListStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Shift/shifts',
            query: {
                'StartDate': startDate,
                'EndDate': endDate,
                'UserId': userId,
                'isPublished': isPublished,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param startDate 
     * @param endDate 
     * @param userId 
     * @returns UsersShiftViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static getUsersShift(
offset?: number,
limit?: number,
startDate?: string,
endDate?: string,
userId?: string,
): CancelablePromise<UsersShiftViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Shift/users/shifts',
            query: {
                'Offset': offset,
                'Limit': limit,
                'StartDate': startDate,
                'EndDate': endDate,
                'UserId': userId,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param startDate 
     * @param endDate 
     * @param userId 
     * @returns UsersShiftViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static getUserShift(
offset?: number,
limit?: number,
startDate?: string,
endDate?: string,
userId?: string,
): CancelablePromise<UsersShiftViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Shift/user/shifts',
            query: {
                'Offset': offset,
                'Limit': limit,
                'StartDate': startDate,
                'EndDate': endDate,
                'UserId': userId,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param startDate 
     * @param endDate 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static publishShifts(
startDate?: string,
endDate?: string,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Shift/shifts/publish',
            query: {
                'startDate': startDate,
                'endDate': endDate,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param id 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static deleteShift(
id?: string,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Shift/shift/delete',
            query: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param shiftId 
     * @param shiftToSwapId 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static swapShift(
shiftId?: string,
shiftToSwapId?: string,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Shift/swap',
            query: {
                'ShiftId': shiftId,
                'ShiftToSwapId': shiftToSwapId,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param id 
     * @param action 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static approveSwap(
id?: string,
action?: number,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Shift/shift/treat-swap',
            query: {
                'id': id,
                'action': action,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param userId 
     * @returns SwapViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static getUserSwapShifts(
offset?: number,
limit?: number,
userId?: string,
): CancelablePromise<SwapViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Shift/user/swaps',
            query: {
                'Offset': offset,
                'Limit': limit,
                'userId': userId,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @returns SwapViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static getAllSwapShifts(
offset?: number,
limit?: number,
): CancelablePromise<SwapViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Shift/swaps',
            query: {
                'Offset': offset,
                'Limit': limit,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

}
