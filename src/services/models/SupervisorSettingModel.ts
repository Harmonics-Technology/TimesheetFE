/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SupervisorSettingModel = {
    userId?: string;
    awaitingTimesheetNotification?: boolean | null;
    awaitingInvoiceNotification?: boolean | null;
    awaitingExpenseNotification?: boolean | null;
    leaveRequestNotification?: boolean | null;
    leaveAwaitingReviewNotification?: boolean | null;
    operationTaskAssignment?: boolean | null;
    trainingAssignment?: boolean | null;
};
