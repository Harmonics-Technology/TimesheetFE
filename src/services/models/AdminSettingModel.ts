/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AdminSettingModel = {
    userId?: string;
    timesheetAwaitingApprovalNotification?: boolean | null;
    awaitingPayrollNotification?: boolean | null;
    awaitingInvoiceNotification?: boolean | null;
    expenseNotification?: boolean | null;
    leaveRequestNotification?: boolean | null;
    leaveAwaitingReviewNotification?: boolean | null;
    operationTaskAssignment?: boolean | null;
    trainingAssignment?: boolean | null;
    contractExpiration?: boolean | null;
    subscriptionRenewalNotification?: boolean | null;
};
