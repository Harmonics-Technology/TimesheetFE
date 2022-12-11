/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TimeSheetHistoryViewPagedCollectionStandardResponse } from '../models/TimeSheetHistoryViewPagedCollectionStandardResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class TimeSheetService {

    /**
     * @param offset 
     * @param limit 
     * @param search 
     * @returns TimeSheetHistoryViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listTimeSheetHistories(
offset?: number,
limit?: number,
search?: string,
): CancelablePromise<TimeSheetHistoryViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/TimeSheet/history',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
            },
        });
    }

}
