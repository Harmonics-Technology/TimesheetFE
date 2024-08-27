/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Department } from './Department';
import type { User } from './User';

export type UserDepartment = {
    id?: string;
    dateCreated?: string;
    dateModified?: string;
    userId?: string;
    user?: User;
    departmentId?: string;
    department?: Department;
};
