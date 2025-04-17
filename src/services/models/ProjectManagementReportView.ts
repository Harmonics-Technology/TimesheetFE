/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OngoingVsCompletedProject } from './OngoingVsCompletedProject';
import type { ProjectBudgetReportView } from './ProjectBudgetReportView';
import type { ProjectOverviewReportView } from './ProjectOverviewReportView';
import type { ProjectProgressTimelineView } from './ProjectProgressTimelineView';
import type { ProjectStatusReportView } from './ProjectStatusReportView';

export type ProjectManagementReportView = {
    ongoingVsCompletedProject?: Array<OngoingVsCompletedProject> | null;
    projectStatusReportData?: ProjectStatusReportView;
    projectOverviewReportData?: Array<ProjectOverviewReportView> | null;
    projectProgressTimelineData?: Array<ProjectProgressTimelineView> | null;
    projectBudgetReportData?: Array<ProjectBudgetReportView> | null;
};
