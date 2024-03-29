/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectSubTaskView } from './ProjectSubTaskView';
import type { ProjectTaskView } from './ProjectTaskView';
import type { UserView } from './UserView';

export type ProjectTaskAsigneeView = {
    id?: string;
    userId?: string;
    user?: UserView;
    projectId?: string | null;
    projectTaskId?: string | null;
    projectTask?: ProjectTaskView;
    hoursLogged?: number;
    budget?: number;
    budgetSpent?: number;
    subTasks?: Array<ProjectSubTaskView> | null;
};
