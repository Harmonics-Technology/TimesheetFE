/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { InvoiceView } from './InvoiceView';
import type { OperationalTaskDashboardMetrics } from './OperationalTaskDashboardMetrics';
import type { ProjectManagementDashboardMetric } from './ProjectManagementDashboardMetric';
import type { ResourceUtilizationOverview } from './ResourceUtilizationOverview';
import type { TimeSheetHistoryView } from './TimeSheetHistoryView';
import type { TopResourceReport } from './TopResourceReport';

export type SuperAdminDashboardView = {
    projectManagementDashboardMetric?: ProjectManagementDashboardMetric;
    operationalTaskDashboardMetrics?: OperationalTaskDashboardMetrics;
    resourceUtilizationOverview?: ResourceUtilizationOverview;
    topResourceReport?: Array<TopResourceReport> | null;
    recentTimeSheet?: Array<TimeSheetHistoryView> | null;
    recentPayrolls?: Array<InvoiceView> | null;
};
