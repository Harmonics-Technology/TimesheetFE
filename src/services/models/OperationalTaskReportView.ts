/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DepartmentOperationalTaskReportView } from './DepartmentOperationalTaskReportView';
import type { OperationalTaskResourceUtilizationReportView } from './OperationalTaskResourceUtilizationReportView';
import type { OperationalTasksStats } from './OperationalTasksStats';
import type { OperationalTaskStatusReportView } from './OperationalTaskStatusReportView';
import type { TaskEfficiencyReportView } from './TaskEfficiencyReportView';

export type OperationalTaskReportView = {
    totalNumberOfTasks?: number;
    taskInProgress?: number;
    taskCompleted?: number;
    taskNotStarted?: number;
    overdueTasks?: number;
    operationalTasksStats?: Array<OperationalTasksStats> | null;
    operationalTaskStatusReportView?: OperationalTaskStatusReportView;
    departmentOperationalTaskReportView?: Array<DepartmentOperationalTaskReportView> | null;
    operationalTaskResourceUtilizationReportView?: Array<OperationalTaskResourceUtilizationReportView> | null;
    taskEfficiencyReportView?: Array<TaskEfficiencyReportView> | null;
};
