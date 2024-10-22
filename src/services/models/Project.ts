/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectManager } from './ProjectManager';
import type { ProjectTaskAsignee } from './ProjectTaskAsignee';
import type { User } from './User';

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
    projectManagerId?: string | null;
    currency?: string | null;
    createdByUserId?: string | null;
    createdByUser?: User;
    assignees?: Array<ProjectTaskAsignee> | null;
    projectManagers?: Array<ProjectManager> | null;
};
