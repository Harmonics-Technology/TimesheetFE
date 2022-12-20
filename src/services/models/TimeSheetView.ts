/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EmployeeInformationView } from './EmployeeInformationView';

export type TimeSheetView = {
    id?: string;
    date?: string;
    isApproved?: boolean;
    employeeInformationId?: string;
    employeeInformation?: EmployeeInformationView;
    hours?: number;
    status?: string | null;
};
