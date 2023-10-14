/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ProjectTimesheetApprovalModel = {
    employeeInformationId?: string;
    timesheetId?: string | null;
    approve?: boolean;
    reason?: string | null;
    dates?: Array<string> | null;
};
