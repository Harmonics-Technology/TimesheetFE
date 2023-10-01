/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Project } from './Project';
import type { ProjectSubTask } from './ProjectSubTask';
import type { ProjectTask } from './ProjectTask';
import type { ProjectTaskAsignee } from './ProjectTaskAsignee';
import type { Status } from './Status';

export type ProjectTimesheet = {
    id?: string;
    dateCreated?: string;
    dateModified?: string;
    projectTaskAsigneeId?: string;
    projectTaskAsignee?: ProjectTaskAsignee;
    projectId?: string | null;
    project?: Project;
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
    statusId?: number | null;
    status?: Status;
    reason?: string | null;
};
