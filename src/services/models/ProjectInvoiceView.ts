/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectInvoiceItemView } from './ProjectInvoiceItemView';
import type { ProjectInvoiceRecipientView } from './ProjectInvoiceRecipientView';

export type ProjectInvoiceView = {
    id?: string;
    superAdminId?: string;
    projectId?: string;
    projectName?: string | null;
    invoiceReference?: string | null;
    subtotal?: number;
    hst?: number;
    total?: number;
    notes?: string | null;
    issuedDate?: string;
    dueDate?: string;
    status?: string | null;
    organization?: string | null;
    recipientId?: string | null;
    recipient?: ProjectInvoiceRecipientView;
    projectInvoiceItems?: Array<ProjectInvoiceItemView> | null;
};
