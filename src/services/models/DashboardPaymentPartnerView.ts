/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { InvoiceView } from './InvoiceView';

export type DashboardPaymentPartnerView = {
    recentPayroll?: Array<InvoiceView> | null;
    recentApprovedInvoice?: Array<InvoiceView> | null;
    recentInvoicedInvoice?: Array<InvoiceView> | null;
};
