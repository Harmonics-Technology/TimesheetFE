/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PayrollManagerSettingModel = {
    userId?: string;
    awaitingPayrollNotification?: boolean | null;
    awaitingTeamMemberInvoiceNotification?: boolean | null;
    awaitingClientInvoiceNotification?: boolean | null;
    awaitingPaymentPartnerInvoiceNotification?: boolean | null;
    awaitingExpenseNotification?: boolean | null;
    operationTaskAssignment?: boolean | null;
    trainingAssignment?: boolean | null;
};
