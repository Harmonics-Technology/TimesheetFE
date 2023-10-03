/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectTimesheetView } from './ProjectTimesheetView';

export type ProjectTimesheetListView = {
    projectTimesheets?: Array<ProjectTimesheetView> | null;
    billable?: number;
    nonBillable?: number;
};
