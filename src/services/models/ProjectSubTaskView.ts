/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectTaskAsigneeView } from './ProjectTaskAsigneeView';
import type { ProjectTaskView } from './ProjectTaskView';

export type ProjectSubTaskView = {
    id?: string;
    projectTaskId?: string;
    projectTask?: ProjectTaskView;
    name?: string | null;
    projectTaskAsigneeId?: string;
    projectTaskAsignee?: ProjectTaskAsigneeView;
    startDate?: string;
    endDate?: string;
    duration?: number;
    hoursSpent?: number | null;
    taskPriority?: string | null;
    note?: string | null;
    status?: string | null;
    trackedByHours?: boolean;
};
