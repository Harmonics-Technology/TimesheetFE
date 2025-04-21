/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AllExpenseReportView } from './AllExpenseReportView';
import type { ExpenseManagementReportView } from './ExpenseManagementReportView';
import type { PayrollSummaryReportView } from './PayrollSummaryReportView';

export type FinancialReportView = {
    totalExpenseRequests?: number;
    totalAmount?: number;
    approvedRequests?: number;
    approvedAmount?: number;
    pendingRequests?: number;
    pendingAmount?: number;
    expenseManagementReport?: Array<ExpenseManagementReportView> | null;
    allExpenseReport?: Array<AllExpenseReportView> | null;
    payrollSummaryReport?: Array<PayrollSummaryReportView> | null;
};
