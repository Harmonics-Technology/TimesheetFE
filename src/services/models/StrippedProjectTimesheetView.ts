/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectSubTaskView } from './ProjectSubTaskView';
import type { StrippedProjectView } from './StrippedProjectView';
import type { StrippedUserView } from './StrippedUserView';

export type StrippedProjectTimesheetView = {
    id?: string;
    projectTaskAsigneeId?: string;
    projectId?: string | null;
    project?: StrippedProjectView;
    projectSubTaskId?: string | null;
    projectSubTask?: ProjectSubTaskView;
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
    isProjectManagementTimesheet?: boolean;
    addToTimesheet?: boolean;
    createdByUserId?: string | null;
    createdByUser?: StrippedUserView;
};
