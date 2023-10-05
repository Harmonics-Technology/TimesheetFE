/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectTask } from './ProjectTask';
import type { ProjectTaskAsignee } from './ProjectTaskAsignee';
import type { ProjectTimesheet } from './ProjectTimesheet';

export type ProjectSubTask = {
    id?: string;
    dateCreated?: string;
    dateModified?: string;
    projectTaskId?: string;
    projectTask?: ProjectTask;
    name?: string | null;
    projectTaskAsigneeId?: string;
    projectTaskAsignee?: ProjectTaskAsignee;
    startDate?: string;
    endDate?: string;
    duration?: number;
    trackedByHours?: boolean;
    durationInHours?: number | null;
    taskPriority?: string | null;
    note?: string | null;
    isCompleted?: boolean;
    percentageOfCompletion?: number;
    projectTimesheets?: Array<ProjectTimesheet> | null;
};
