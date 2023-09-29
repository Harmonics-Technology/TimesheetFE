/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectTimesheetRange } from './ProjectTimesheetRange';

export type ProjectTimesheetModel = {
    id?: string | null;
    projectTaskAsigneeId?: string;
    projectId?: string;
    projectTaskId?: string | null;
    projectSubTaskId?: string | null;
    projectTimesheets?: Array<ProjectTimesheetRange> | null;
};
