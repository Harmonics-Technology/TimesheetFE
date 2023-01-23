/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { InvoiceView } from './InvoiceView';
import type { RecentPayrollView } from './RecentPayrollView';

export type DashboardPaymentPartnerView = {
    recentPayroll?: Array<RecentPayrollView> | null;
    recentApprovedInvoice?: Array<InvoiceView> | null;
    recentInvoicedInvoice?: Array<InvoiceView> | null;
};
