/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { RecordsToDownload } from '../models/RecordsToDownload';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ExportService {

    /**
     * @param record 
     * @param supervisorId 
     * @param clientId 
     * @param paymentPartnerId 
     * @param startDate 
     * @param endDate 
     * @returns any Success
     * @throws ApiError
     */
    public static exportUserRecord(
record?: RecordsToDownload,
supervisorId?: string,
clientId?: string,
paymentPartnerId?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Export/users',
            query: {
                'Record': record,
                'SupervisorId': supervisorId,
                'ClientId': clientId,
                'PaymentPartnerId': paymentPartnerId,
                'StartDate': startDate,
                'EndDate': endDate,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }

}
