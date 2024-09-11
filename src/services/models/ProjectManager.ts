/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Project } from './Project';
import type { User } from './User';

export type ProjectManager = {
    id?: string;
    dateCreated?: string;
    dateModified?: string;
    userId?: string;
    user?: User;
    projectId?: string;
    project?: Project;
};
