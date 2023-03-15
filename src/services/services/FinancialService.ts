/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AdminPaymentScheduleViewListStandardResponse } from '../models/AdminPaymentScheduleViewListStandardResponse';
import type { BooleanStandardResponse } from '../models/BooleanStandardResponse';
import type { ExpenseModel } from '../models/ExpenseModel';
import type { ExpenseViewPagedCollectionStandardResponse } from '../models/ExpenseViewPagedCollectionStandardResponse';
import type { ExpenseViewStandardResponse } from '../models/ExpenseViewStandardResponse';
import type { InvoiceViewPagedCollectionStandardResponse } from '../models/InvoiceViewPagedCollectionStandardResponse';
import type { InvoiceViewStandardResponse } from '../models/InvoiceViewStandardResponse';
import type { PaymentPartnerInvoiceModel } from '../models/PaymentPartnerInvoiceModel';
import type { PaymentScheduleListStandardResponse } from '../models/PaymentScheduleListStandardResponse';
import type { PayrollViewPagedCollectionStandardResponse } from '../models/PayrollViewPagedCollectionStandardResponse';
import type { PaySlipViewPagedCollectionStandardResponse } from '../models/PaySlipViewPagedCollectionStandardResponse';
import type { RejectPaymentPartnerInvoiceModel } from '../models/RejectPaymentPartnerInvoiceModel';

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
     * @param employeeInformationId 
     * @param search 
     * @param startDate 
     * @param endDate 
     * @returns ExpenseViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listExpenses(
offset?: number,
limit?: number,
employeeInformationId?: string,
search?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<ExpenseViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/expenses',
            query: {
                'Offset': offset,
                'Limit': limit,
                'employeeInformationId': employeeInformationId,
                'search': search,
                'StartDate': startDate,
                'EndDate': endDate,
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
     * @param search 
     * @param startDate 
     * @param endDate 
     * @returns ExpenseViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listSuperviseesExpenses(
offset?: number,
limit?: number,
search?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<ExpenseViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/supervisees-expenses',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
                'StartDate': startDate,
                'EndDate': endDate,
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
     * @param search 
     * @param startDate 
     * @param endDate 
     * @returns ExpenseViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listClientTeamMembersExpenses(
offset?: number,
limit?: number,
search?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<ExpenseViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/client/team-member-expenses',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
                'StartDate': startDate,
                'EndDate': endDate,
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
     * @param search 
     * @param startDate 
     * @param endDate 
     * @returns ExpenseViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listReviewedExpenses(
offset?: number,
limit?: number,
search?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<ExpenseViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/expenses/reviewed',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
                'StartDate': startDate,
                'EndDate': endDate,
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
    public static reviewExpense(
expenseId: string,
): CancelablePromise<ExpenseViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Financial/expense/{expenseId}/review',
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

    /**
     * @param offset 
     * @param limit 
     * @param employeeInformationId 
     * @returns PayrollViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listPayrolls(
offset?: number,
limit?: number,
employeeInformationId?: string,
): CancelablePromise<PayrollViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/payrolls',
            query: {
                'Offset': offset,
                'Limit': limit,
                'employeeInformationId': employeeInformationId,
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
     * @param employeeInformationId 
     * @returns PayrollViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listPendingPayrolls(
offset?: number,
limit?: number,
employeeInformationId?: string,
): CancelablePromise<PayrollViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/payrolls/pending',
            query: {
                'Offset': offset,
                'Limit': limit,
                'employeeInformationId': employeeInformationId,
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
     * @param employeeInformationId 
     * @returns PayrollViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listApprovedPayrolls(
offset?: number,
limit?: number,
employeeInformationId?: string,
): CancelablePromise<PayrollViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/payrolls/approved',
            query: {
                'Offset': offset,
                'Limit': limit,
                'employeeInformationId': employeeInformationId,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param payrollId 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static approvePayroll(
payrollId?: string,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Financial/payroll/approve',
            query: {
                'payrollId': payrollId,
            },
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param employeeInformationId 
     * @param startDate 
     * @param endDate 
     * @returns PaySlipViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listPaySlips(
offset?: number,
limit?: number,
employeeInformationId?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<PaySlipViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/payslips',
            query: {
                'Offset': offset,
                'Limit': limit,
                'employeeInformationId': employeeInformationId,
                'StartDate': startDate,
                'EndDate': endDate,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param payrollId 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static generatePaySlip(
payrollId?: string,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Financial/generate-payslip',
            query: {
                'payrollId': payrollId,
            },
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @param search 
     * @param startDate 
     * @param endDate 
     * @returns ExpenseViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listApprovedExpenses(
offset?: number,
limit?: number,
search?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<ExpenseViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Financial/expenses/approved',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
                'StartDate': startDate,
                'EndDate': endDate,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static generateInvoicePayroll(
requestBody?: Array<string>,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Financial/invoice/payroll/generate',
            body: requestBody,
            mediaType: 'application/json-patch+json',
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static generateInvoiceExpense(
requestBody?: Array<string>,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Financial/invoice/expense/generate',
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
     * @param startDate 
     * @param endDate 
     * @returns ExpenseViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listAllApprovedExpenses(
offset?: number,
limit?: number,
search?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<ExpenseViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/expenses/approved/all',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
                'StartDate': startDate,
                'EndDate': endDate,
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
     * @param search 
     * @param startDate 
     * @param endDate 
     * @returns InvoiceViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listInvoices(
offset?: number,
limit?: number,
search?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<InvoiceViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/invoices/list',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
                'StartDate': startDate,
                'EndDate': endDate,
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
     * @param search 
     * @param startDate 
     * @param endDate 
     * @returns InvoiceViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listSubmittedOnshoreInvoices(
offset?: number,
limit?: number,
search?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<InvoiceViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/invoices/onshore/submitted',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
                'StartDate': startDate,
                'EndDate': endDate,
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
     * @param search 
     * @param startDate 
     * @param endDate 
     * @returns InvoiceViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listSubmittedOffshoreInvoices(
offset?: number,
limit?: number,
search?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<InvoiceViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/invoices/offshore/submitted',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
                'StartDate': startDate,
                'EndDate': endDate,
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
     * @param search 
     * @param startDate 
     * @param endDate 
     * @param payrollTypeFilter 
     * @returns InvoiceViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listSubmittedInvoices(
offset?: number,
limit?: number,
search?: string,
startDate?: string,
endDate?: string,
payrollTypeFilter?: number,
): CancelablePromise<InvoiceViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/invoices/submitted',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
                'StartDate': startDate,
                'EndDate': endDate,
                'payrollTypeFilter': payrollTypeFilter,
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
     * @param search 
     * @param payrollGroupId 
     * @param startDate 
     * @param endDate 
     * @returns InvoiceViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listPendingInvoiceForPaymentPartner(
offset?: number,
limit?: number,
search?: string,
payrollGroupId?: number,
startDate?: string,
endDate?: string,
): CancelablePromise<InvoiceViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/invoices/payment-partner/pending',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
                'payrollGroupId': payrollGroupId,
                'StartDate': startDate,
                'EndDate': endDate,
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
     * @param search 
     * @param startDate 
     * @param endDate 
     * @returns InvoiceViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listPendingInvoicedInvoicesForPaymentPartner(
offset?: number,
limit?: number,
search?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<InvoiceViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/invoices/payment-partner/pending-invoiced',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
                'StartDate': startDate,
                'EndDate': endDate,
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
     * @param search 
     * @param startDate 
     * @param endDate 
     * @param payrollTypeFilter 
     * @returns InvoiceViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listInvoicedInvoices(
offset?: number,
limit?: number,
search?: string,
startDate?: string,
endDate?: string,
payrollTypeFilter?: number,
): CancelablePromise<InvoiceViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/invoices/invoiced',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
                'StartDate': startDate,
                'EndDate': endDate,
                'payrollTypeFilter': payrollTypeFilter,
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
     * @param search 
     * @param startDate 
     * @param endDate 
     * @returns InvoiceViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listTeamMemberSubmittedInvoices(
offset?: number,
limit?: number,
search?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<InvoiceViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/invoices/team-member/submitted',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
                'StartDate': startDate,
                'EndDate': endDate,
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
     * @param search 
     * @param startDate 
     * @param endDate 
     * @param status 
     * @returns InvoiceViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listTeamMemberInvoices(
offset?: number,
limit?: number,
search?: string,
startDate?: string,
endDate?: string,
status?: number,
): CancelablePromise<InvoiceViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/invoices/team-member',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
                'StartDate': startDate,
                'EndDate': endDate,
                'status': status,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param invoiceId 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static submitInvoice(
invoiceId?: string,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Financial/invoice/submit',
            query: {
                'invoiceId': invoiceId,
            },
        });
    }

    /**
     * @param invoiceId 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static treatSubmittedInvoice(
invoiceId?: string,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Financial/invoice/treat',
            query: {
                'invoiceId': invoiceId,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static rejectPaymentPartnerInvoice(
requestBody?: RejectPaymentPartnerInvoiceModel,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Financial/invoice/payment-partner/reject',
            body: requestBody,
            mediaType: 'application/json-patch+json',
        });
    }

    /**
     * @param offset 
     * @param limit 
     * @returns PayrollViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listPayrollsByPaymentPartner(
offset?: number,
limit?: number,
): CancelablePromise<PayrollViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/payrolls/paymentpartner',
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

    /**
     * @param offset 
     * @param limit 
     * @returns PayrollViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listClientTeamMembersPayroll(
offset?: number,
limit?: number,
): CancelablePromise<PayrollViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/payrolls/client-team-members',
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

    /**
     * @param offset 
     * @param limit 
     * @param search 
     * @param payrollGroupId 
     * @param startDate 
     * @param endDate 
     * @returns InvoiceViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listInvoicesByPaymentPartner(
offset?: number,
limit?: number,
search?: string,
payrollGroupId?: number,
startDate?: string,
endDate?: string,
): CancelablePromise<InvoiceViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/paymentpartner/invoices',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
                'payrollGroupId': payrollGroupId,
                'StartDate': startDate,
                'EndDate': endDate,
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
     * @param search 
     * @param startDate 
     * @param endDate 
     * @returns ExpenseViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listExpensesByPaymentPartner(
offset?: number,
limit?: number,
search?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<ExpenseViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/paymentpartner/expenses',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
                'StartDate': startDate,
                'EndDate': endDate,
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
     * @param search 
     * @returns PaySlipViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listPaySlipsByTeamMember(
offset?: number,
limit?: number,
search?: string,
): CancelablePromise<PaySlipViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/team-member/payslips',
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
     * @param year 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static generatePaymentSchedule(
year: number,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/schedule/{year}',
            path: {
                'year': year,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param year 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static generateBiweeklyPaymentSchedule(
year: number,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/schedule/biweekly/{year}',
            path: {
                'year': year,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param year 
     * @returns BooleanStandardResponse Success
     * @throws ApiError
     */
    public static generateWeeklyPaymentSchedule(
year: number,
): CancelablePromise<BooleanStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/schedule/weekly/{year}',
            path: {
                'year': year,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param employeeInformationId 
     * @returns PaymentScheduleListStandardResponse Success
     * @throws ApiError
     */
    public static getEmployeePaymentSchedule(
employeeInformationId?: string,
): CancelablePromise<PaymentScheduleListStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/employee/schedule',
            query: {
                'employeeInformationId': employeeInformationId,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @returns AdminPaymentScheduleViewListStandardResponse Success
     * @throws ApiError
     */
    public static getPaymentSchedules(): CancelablePromise<AdminPaymentScheduleViewListStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/admin/schedules',
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns InvoiceViewStandardResponse Success
     * @throws ApiError
     */
    public static createPaymentPartnerInvoice(
requestBody?: PaymentPartnerInvoiceModel,
): CancelablePromise<InvoiceViewStandardResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/Financial/payment-partner/invoice/create',
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
     * @param payrollGroupId 
     * @param startDate 
     * @param endDate 
     * @returns InvoiceViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listPaymentPartnerInvoices(
offset?: number,
limit?: number,
search?: string,
payrollGroupId?: number,
startDate?: string,
endDate?: string,
): CancelablePromise<InvoiceViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/payment-partner/invoices',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
                'payrollGroupId': payrollGroupId,
                'StartDate': startDate,
                'EndDate': endDate,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param payrollGroupId 
     * @param offset 
     * @param limit 
     * @param search 
     * @param startDate 
     * @param endDate 
     * @returns InvoiceViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listPayrollGroupInvoices(
payrollGroupId?: number,
offset?: number,
limit?: number,
search?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<InvoiceViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/payroll-group/invoices',
            query: {
                'payrollGroupId': payrollGroupId,
                'Offset': offset,
                'Limit': limit,
                'search': search,
                'StartDate': startDate,
                'EndDate': endDate,
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
     * @param clientId 
     * @param search 
     * @param startDate 
     * @param endDate 
     * @returns InvoiceViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listClientInvoices(
offset?: number,
limit?: number,
clientId?: string,
search?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<InvoiceViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/client/invoices',
            query: {
                'Offset': offset,
                'Limit': limit,
                'clientId': clientId,
                'search': search,
                'StartDate': startDate,
                'EndDate': endDate,
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
     * @param search 
     * @param startDate 
     * @param endDate 
     * @returns InvoiceViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listInvoicesHistories(
offset?: number,
limit?: number,
search?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<InvoiceViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/invoices/history',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
                'StartDate': startDate,
                'EndDate': endDate,
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
     * @param search 
     * @param payrollGroupId 
     * @param startDate 
     * @param endDate 
     * @returns InvoiceViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listPaymentPartnerInvoicesForPayrollManagers(
offset?: number,
limit?: number,
search?: string,
payrollGroupId?: number,
startDate?: string,
endDate?: string,
): CancelablePromise<InvoiceViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/payroll-manager-payment-partner/invoices',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
                'payrollGroupId': payrollGroupId,
                'StartDate': startDate,
                'EndDate': endDate,
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
     * @param search 
     * @param startDate 
     * @param endDate 
     * @returns InvoiceViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listAllClientInvoices(
offset?: number,
limit?: number,
search?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<InvoiceViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/payroll-manager-client/invoices',
            query: {
                'Offset': offset,
                'Limit': limit,
                'search': search,
                'StartDate': startDate,
                'EndDate': endDate,
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
     * @param clientId 
     * @param search 
     * @param startDate 
     * @param endDate 
     * @returns InvoiceViewPagedCollectionStandardResponse Success
     * @throws ApiError
     */
    public static listClientTeamMemberInvoices(
offset?: number,
limit?: number,
clientId?: string,
search?: string,
startDate?: string,
endDate?: string,
): CancelablePromise<InvoiceViewPagedCollectionStandardResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/Financial/client/team-members/invoices',
            query: {
                'Offset': offset,
                'Limit': limit,
                'clientId': clientId,
                'search': search,
                'StartDate': startDate,
                'EndDate': endDate,
            },
            errors: {
                400: `Bad Request`,
                500: `Server Error`,
            },
        });
    }

}
