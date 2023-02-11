/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EmployeeInformationView } from './EmployeeInformationView';
import type { ExpenseView } from './ExpenseView';
import type { PayrollView } from './PayrollView';

export type InvoiceView = {
    id?: string;
    employeeInformationId?: string | null;
    employeeInformation?: EmployeeInformationView;
    name?: string | null;
    paymentPartnerName?: string | null;
    payrollGroupName?: string | null;
    startDate?: string;
    endDate?: string;
    invoiceReference?: string | null;
    totalHours?: number;
    totalAmount?: number;
    rate?: string | null;
    paymentDate?: string;
    status?: string | null;
    invoiceType?: string | null;
    rejectionReason?: string | null;
    payrolls?: Array<PayrollView> | null;
    expenses?: Array<ExpenseView> | null;
    children?: Array<InvoiceView> | null;
    dateCreated?: string;
};
