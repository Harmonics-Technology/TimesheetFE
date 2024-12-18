/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type TeamMemberSettingModel = {
    userId?: string;
    timesheetSubmissionNotification?: boolean | null;
    timeSheetApprovalNotification?: boolean | null;
    timesheetRejectionNotification?: boolean | null;
    awaitingInvoiceNotification?: boolean | null;
    expenseNotification?: boolean | null;
    operationalTaskAssignmentNotification?: boolean | null;
    trainingAssignmentNotification?: boolean | null;
};
