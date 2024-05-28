/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TaskPriority } from './TaskPriority';

export type ProjectTaskModel = {
    id?: string | null;
    superAdminId?: string;
    projectId?: string | null;
    name?: string | null;
    assignedUsers?: Array<string> | null;
    department?: string | null;
    startDate?: string;
    endDate?: string;
    duration?: number | null;
    trackedByHours?: boolean;
    durationInHours?: number | null;
    taskPriority?: TaskPriority;
    note?: string | null;
    isAssignedToMe?: boolean;
    isOperationalTask?: boolean;
    operationalTaskStatus?: string | null;
};
