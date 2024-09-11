/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OperationalTaskDashboardMetrics } from './OperationalTaskDashboardMetrics';
import type { PaySlipView } from './PaySlipView';
import type { ProjectManagementDashboardMetric } from './ProjectManagementDashboardMetric';
import type { RecentTimeSheetView } from './RecentTimeSheetView';

export type TeammemberDashboardView = {
    projectManagementDashboardMetric?: ProjectManagementDashboardMetric;
    operationalTaskDashboardMetrics?: OperationalTaskDashboardMetrics;
    recentTimeSheet?: Array<RecentTimeSheetView> | null;
    recentPayslips?: Array<PaySlipView> | null;
};
