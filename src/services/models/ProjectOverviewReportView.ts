/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectManagerView } from './ProjectManagerView';

export type ProjectOverviewReportView = {
    project?: string | null;
    projectManager?: Array<ProjectManagerView> | null;
    startDate?: string;
    endDate?: string;
    projectStatus?: string | null;
};
