/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectSubTask } from './ProjectSubTask';
import type { ProjectTask } from './ProjectTask';
import type { ProjectView } from './ProjectView';

export type ProjectTimesheetView = {
    id?: string;
    projectTaskAsigneeId?: string;
    projectId?: string | null;
    project?: ProjectView;
    projectTaskId?: string | null;
    projectTask?: ProjectTask;
    projectSubTaskId?: string | null;
    projectSubTask?: ProjectSubTask;
    startDate?: string;
    endDate?: string;
    percentageOfCompletion?: number;
    billable?: boolean;
    totalHours?: number;
    amountEarned?: number;
    status?: string | null;
    reason?: string | null;
    isApproved?: boolean;
    isEdited?: boolean;
};
