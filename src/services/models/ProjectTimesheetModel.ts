/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ProjectTimesheetModel = {
    id?: string | null;
    projectTaskAsigneeId?: string;
    projectId?: string;
    projectTaskId?: string | null;
    projectSubTaskId?: string | null;
    startDate?: string;
    endDate?: string;
    percentageOfCompletion?: number;
    billable?: boolean;
};
