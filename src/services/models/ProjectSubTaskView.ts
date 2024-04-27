/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ProjectSubTaskView = {
    id?: string;
    projectTaskId?: string;
    name?: string | null;
    projectTaskAsigneeId?: string;
    assignee?: string | null;
    startDate?: string;
    endDate?: string;
    duration?: number;
    hoursSpent?: number | null;
    taskPriority?: string | null;
    note?: string | null;
    status?: string | null;
    trackedByHours?: boolean;
    percentageOfCompletion?: number;
};
