/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectInvoiceItemModel } from './ProjectInvoiceItemModel';

export type ProjectInvoiceModel = {
    id?: string | null;
    superAdminId?: string;
    projectId?: string;
    subtotal?: number;
    hst?: number;
    total?: number;
    notes?: string | null;
    issuedDate?: string;
    dueDate?: string;
    organization?: string | null;
    posNumber?: string | null;
    invoiceItems?: Array<ProjectInvoiceItemModel> | null;
    recipientId?: string | null;
};
