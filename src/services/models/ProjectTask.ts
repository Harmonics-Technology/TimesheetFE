/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectSubTask } from './ProjectSubTask';
import type { ProjectTaskAsignee } from './ProjectTaskAsignee';
import type { User } from './User';

export type ProjectTask = {
    id?: string;
    dateCreated?: string;
    dateModified?: string;
    superAdminId?: string;
    projectId?: string | null;
    name?: string | null;
    department?: string | null;
    startDate?: string;
    endDate?: string;
    duration?: number | null;
    trackedByHours?: boolean | null;
    durationInHours?: number | null;
    taskPriority?: string | null;
    note?: string | null;
    isCompleted?: boolean;
    percentageOfCompletion?: number;
    isAssignedToMe?: boolean | null;
    isOperationalTask?: boolean;
    operationalTaskStatus?: string | null;
    createdByUserId?: string | null;
    createdByUser?: User;
    operationalTaskHours?: number | null;
    subTasks?: Array<ProjectSubTask> | null;
    assignees?: Array<ProjectTaskAsignee> | null;
};
