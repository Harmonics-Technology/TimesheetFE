/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EmployeeInformationView } from './EmployeeInformationView';

export type TimeSheetMonthlyView = {
    id?: string;
    date?: string;
    isApproved?: boolean;
    employeeInformationId?: string;
    employeeInformation?: EmployeeInformationView;
    hours?: number;
};
