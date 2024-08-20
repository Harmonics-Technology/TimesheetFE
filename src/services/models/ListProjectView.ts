/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { StrippedProjectAssignee } from './StrippedProjectAssignee';
import type { StrippedProjectManager } from './StrippedProjectManager';

export type ListProjectView = {
    id?: string;
    name?: string | null;
    startDate?: string;
    endDate?: string;
    budget?: number;
    note?: string | null;
    documentURL?: string | null;
    progress?: number | null;
    status?: string | null;
    isCompleted?: boolean;
    budgetThreshold?: number;
    projectManagerId?: string | null;
    currency?: string | null;
    assignees?: Array<StrippedProjectAssignee> | null;
    projectManagers?: Array<StrippedProjectManager> | null;
};
