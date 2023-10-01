/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BudgetBurnOutRate } from './BudgetBurnOutRate';
import type { OprationTasksVsProjectTask } from './OprationTasksVsProjectTask';
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
};
