/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NotificationViewPagedCollectionStandardResponse } from '../models/NotificationViewPagedCollectionStandardResponse';
import type { NotificationViewStandardResponse } from '../models/NotificationViewStandardResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class NotificationService {

    /**
     * @param offset 
     * @param limit 
     * @returns NotificationViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listMyNotifications(
offset?: number,
limit?: number,
): CancelablePromise<NotificationViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Notification/list',
            query: {
                'Offset': offset,
                'Limit': limit,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }

    /**
     * @param id 
     * @returns NotificationViewStandardResponse Success
     * @throws ApiError
     */
    public static getNotification(
id: string,
): CancelablePromise<NotificationViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Notification/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
            },
        });
    }

}
