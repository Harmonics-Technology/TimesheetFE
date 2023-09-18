/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type LeaveModel = {
    id?: string | null;
    employeeInformationId?: string;
    leaveTypeId?: string;
    startDate?: string;
    endDate?: string;
    reasonForLeave?: string | null;
    workAssigneeId?: string | null;
    noOfLeaveDaysApplied?: number;
};
