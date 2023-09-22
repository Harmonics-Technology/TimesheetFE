/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TaskPriority } from './TaskPriority';

export type ProjectSubTaskModel = {
    id?: string | null;
    projectTaskId?: string;
    name?: string | null;
    projectTaskAsigneeId?: string;
    startDate?: string;
    endDate?: string;
    duration?: number;
    trackedByHours?: boolean;
    durationInHours?: number | null;
    taskPriority?: TaskPriority;
    note?: string | null;
};
