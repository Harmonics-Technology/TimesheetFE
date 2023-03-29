/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ExpenseRecordsToDownload } from '../models/ExpenseRecordsToDownload';
import type { InvoiceRecord } from '../models/InvoiceRecord';
import type { PayslipRecordToDownload } from '../models/PayslipRecordToDownload';
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
     * @param rowHeaders 
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
rowHeaders?: Array<string>,
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
                'rowHeaders': rowHeaders,
                'StartDate': startDate,
                'EndDate': endDate,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }

    /**
     * @param record 
     * @param payrollGroupId 
     * @param rowHeaders 
     * @param startDate 
     * @param endDate 
     * @returns any Success
     * @throws ApiError
     */
    public static exportInvoiceRecord(
record?: InvoiceRecord,
payrollGroupId?: number,
rowHeaders?: Array<string>,
startDate?: string,
endDate?: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Export/invoice',
            query: {
                'Record': record,
                'PayrollGroupId': payrollGroupId,
                'rowHeaders': rowHeaders,
                'StartDate': startDate,
                'EndDate': endDate,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }

    /**
     * @param record 
     * @param rowHeaders 
     * @param startDate 
     * @param endDate 
     * @returns any Success
     * @throws ApiError
     */
    public static exportExpenseRecord(
record?: ExpenseRecordsToDownload,
rowHeaders?: Array<string>,
startDate?: string,
endDate?: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Export/expense',
            query: {
                'Record': record,
                'rowHeaders': rowHeaders,
                'StartDate': startDate,
                'EndDate': endDate,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }

    /**
     * @param record 
     * @param rowHeaders 
     * @param startDate 
     * @param endDate 
     * @returns any Success
     * @throws ApiError
     */
    public static exportPayslipRecord(
record?: PayslipRecordToDownload,
rowHeaders?: Array<string>,
startDate?: string,
endDate?: string,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Export/payslip',
            query: {
                'Record': record,
                'rowHeaders': rowHeaders,
                'StartDate': startDate,
                'EndDate': endDate,
            },
            errors: {
                401: `Unauthorized`,
            },
        });
    }

}
