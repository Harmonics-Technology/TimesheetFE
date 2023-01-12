/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EmployeeInformationView } from './EmployeeInformationView';

export type PaySlipView = {
    id?: string;
    companyName?: string | null;
    name?: string | null;
    address?: string | null;
    employeeInformation?: EmployeeInformationView;
    startDate?: string;
    endDate?: string;
    paymentDate?: string;
    totalHours?: number;
    totalAmount?: number;
};
