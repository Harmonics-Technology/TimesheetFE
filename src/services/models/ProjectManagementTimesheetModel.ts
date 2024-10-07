/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ProjectManagementTimesheetModel = {
    id?: string | null;
    projectTaskAsigneeId?: string;
    projectId?: string;
    projectTaskId?: string;
    projectSubTaskId?: string | null;
    addToTimesheet?: boolean;
    startDate?: string;
    endDate?: string;
    hours?: number;
    percentageOfCompletion?: number;
    startTime?: number;
};
