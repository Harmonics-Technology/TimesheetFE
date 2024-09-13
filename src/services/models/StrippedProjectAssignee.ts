/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type StrippedProjectAssignee = {
    id?: string;
    userId?: string;
    fullName?: string | null;
    disabled?: boolean;
    projectId?: string | null;
    projectTaskId?: string | null;
    addTaskToTimesheet?: boolean;
    projectManagementTimesheetHours?: number | null;
};
