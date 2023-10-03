/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectSubTask } from './ProjectSubTask';
import type { ProjectTaskAsignee } from './ProjectTaskAsignee';

export type ProjectTask = {
    id?: string;
    dateCreated?: string;
    dateModified?: string;
    superAdminId?: string;
    projectId?: string | null;
    name?: string | null;
    category?: string | null;
    department?: string | null;
    startDate?: string;
    endDate?: string;
    duration?: number | null;
    trackedByHours?: boolean;
    durationInHours?: number;
    taskPriority?: string | null;
    note?: string | null;
    isCompleted?: boolean;
    subTasks?: Array<ProjectSubTask> | null;
    assignees?: Array<ProjectTaskAsignee> | null;
};
