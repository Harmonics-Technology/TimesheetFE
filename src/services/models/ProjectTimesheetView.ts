/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectView } from './ProjectView';

export type ProjectTimesheetView = {
    id?: string;
    projectTaskAsigneeId?: string;
    projectId?: string;
    project?: ProjectView;
    projectTaskId?: string | null;
    projectSubTaskId?: string | null;
    startDate?: string;
    endDate?: string;
    percentageOfCompletion?: number;
    billable?: boolean;
    totalHours?: number;
    amountEarned?: number;
};
