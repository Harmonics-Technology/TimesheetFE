/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ClientSubscriptionInvoiceViewValue = {
    id?: string | null;
    clientId?: string | null;
    billingAccount?: string | null;
    clientSubscriptionId?: string | null;
    invoiceReference?: string | null;
    licenceType?: string | null;
    startDate?: string;
    endDate?: string;
    status?: string | null;
    paymentStatus?: string | null;
    amountInCent?: number;
    invoicePDFURL?: string | null;
    hostedInvoiceURL?: string | null;
};
