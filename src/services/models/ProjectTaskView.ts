/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectTaskAsigneeView } from './ProjectTaskAsigneeView';

export type ProjectTaskView = {
    id?: string;
    superAdminId?: string;
    projectId?: string | null;
    name?: string | null;
    category?: string | null;
    department?: string | null;
    startDate?: string;
    endDate?: string;
    taskPriority?: string | null;
    note?: string | null;
    hoursSpent?: number | null;
    subTaskCount?: number | null;
    status?: string | null;
    progress?: number | null;
    assignees?: Array<ProjectTaskAsigneeView> | null;
};
