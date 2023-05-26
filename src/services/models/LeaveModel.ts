/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type LeaveModel = {
    employeeInformationId?: string;
    leaveTypeId?: string;
    startDate?: string;
    endDate?: string;
    reasonForLeave?: string | null;
    workAssigneeId?: string | null;
    noOfLeaveDaysApplied?: number;
};
