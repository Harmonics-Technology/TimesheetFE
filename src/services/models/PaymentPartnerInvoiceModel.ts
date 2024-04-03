/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ApprovedPayrollInvoices } from './ApprovedPayrollInvoices';

export type PaymentPartnerInvoiceModel = {
    invoices?: Array<ApprovedPayrollInvoices> | null;
    totalAmount?: number;
    rate?: string | null;
    clientId?: string;
};
