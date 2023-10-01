/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BillableAndNonBillable } from './BillableAndNonBillable';
import type { BudgetBurnOutRate } from './BudgetBurnOutRate';
import type { OprationTasksVsProjectTask } from './OprationTasksVsProjectTask';
import type { ProjectStatusesCount } from './ProjectStatusesCount';
import type { ProjectView } from './ProjectView';

export type DashboardProjectManagementView = {
    noOfProject?: number;
    noOfTask?: number;
    totalHours?: number;
    totalBudgetSpent?: number;
    projectSummary?: Array<ProjectView> | null;
    overdueProjects?: Array<ProjectView> | null;
    oprationalAndProjectTasksStats?: Array<OprationTasksVsProjectTask> | null;
    budgetBurnOutRates?: Array<BudgetBurnOutRate> | null;
    projectStatusesCount?: ProjectStatusesCount;
    billableAndNonBillable?: BillableAndNonBillable;
};
