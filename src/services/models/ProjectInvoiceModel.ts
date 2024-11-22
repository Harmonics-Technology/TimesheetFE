/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectInvoiceItemModel } from './ProjectInvoiceItemModel';
import type { ProjectInvoiceRecipientModel } from './ProjectInvoiceRecipientModel';

export type ProjectInvoiceModel = {
    id?: string | null;
    superAdminId?: string;
    projectId?: string;
    invoiceReference?: string | null;
    subtotal?: number;
    hst?: number;
    total?: number;
    notes?: string | null;
    issuedDate?: string;
    dueDate?: string;
    organization?: string | null;
    invoiceItems?: Array<ProjectInvoiceItemModel> | null;
    recipients?: Array<ProjectInvoiceRecipientModel> | null;
};
