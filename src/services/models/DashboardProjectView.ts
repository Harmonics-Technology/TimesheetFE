/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BudgetSpentVsBudgetRemain } from './BudgetSpentVsBudgetRemain';
import type { MonthlyCompletedTask } from './MonthlyCompletedTask';
import type { ProjectTaskStatusCount } from './ProjectTaskStatusCount';
import type { ProjectTaskView } from './ProjectTaskView';

export type DashboardProjectView = {
    resources?: number;
    totalTasks?: number;
    totalHours?: number;
    upcomingDeadlines?: Array<ProjectTaskView> | null;
    budgetSpentAndRemain?: BudgetSpentVsBudgetRemain;
    projectTaskStatus?: ProjectTaskStatusCount;
    monthlyCompletedTasks?: Array<MonthlyCompletedTask> | null;
};
