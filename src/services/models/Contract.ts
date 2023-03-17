/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EmployeeInformation } from './EmployeeInformation';
import type { Status } from './Status';

export type Contract = {
    id?: string;
    dateCreated?: string;
    dateModified?: string;
    title?: string | null;
    startDate?: string;
    endDate?: string;
    document?: string | null;
    statusId?: number;
    status?: Status;
    employeeInformationId?: string;
    employeeInformation?: EmployeeInformation;
};
