/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectMetrics } from './ProjectMetrics';
import type { ProjectTaskAsigneeView } from './ProjectTaskAsigneeView';

export type ProjectView = {
    id?: string;
    superAdminId?: string;
    name?: string | null;
    startDate?: string;
    endDate?: string;
    duration?: number;
    budget?: number;
    note?: string | null;
    documentURL?: string | null;
    progress?: number | null;
    status?: string | null;
    projectMetrics?: ProjectMetrics;
    isCompleted?: boolean;
    budgetThreshold?: number;
    projectManagerId?: string | null;
    assignees?: Array<ProjectTaskAsigneeView> | null;
};
