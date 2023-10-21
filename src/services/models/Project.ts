/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectTaskAsignee } from './ProjectTaskAsignee';

export type Project = {
    id?: string;
    dateCreated?: string;
    dateModified?: string;
    superAdminId?: string;
    name?: string | null;
    startDate?: string;
    endDate?: string;
    duration?: number;
    budget?: number;
    note?: string | null;
    documentURL?: string | null;
    isCompleted?: boolean;
    budgetSpent?: number;
    hoursSpent?: number;
    budgetThreshold?: number | null;
    assignees?: Array<ProjectTaskAsignee> | null;
};
