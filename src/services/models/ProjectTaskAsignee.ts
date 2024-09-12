/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Project } from './Project';
import type { ProjectSubTask } from './ProjectSubTask';
import type { ProjectTask } from './ProjectTask';
import type { User } from './User';

export type ProjectTaskAsignee = {
    id?: string;
    dateCreated?: string;
    dateModified?: string;
    userId?: string;
    user?: User;
    projectId?: string | null;
    project?: Project;
    projectTaskId?: string | null;
    projectTask?: ProjectTask;
    hoursLogged?: number;
    budget?: number | null;
    budgetSpent?: number | null;
    disabled?: boolean;
    addTaskToTimesheet?: boolean;
    subTasks?: Array<ProjectSubTask> | null;
};
