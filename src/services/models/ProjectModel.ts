/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ProjectModel = {
    id?: string | null;
    superAdminId?: string;
    name?: string | null;
    startDate?: string;
    endDate?: string;
    duration?: number;
    budget?: number;
    assignedUsers?: Array<string> | null;
    note?: string | null;
    documentURL?: string | null;
    statusId?: number;
    budgetThreshold?: number | null;
    projectManagerId?: string | null;
    currency?: string | null;
    projectManagers?: Array<string> | null;
};
