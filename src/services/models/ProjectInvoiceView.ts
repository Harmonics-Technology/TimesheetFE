/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectInvoiceItemView } from './ProjectInvoiceItemView';
import type { ProjectInvoiceRecipientView } from './ProjectInvoiceRecipientView';
import type { UserView } from './UserView';

export type ProjectInvoiceView = {
    id?: string;
    superAdminId?: string;
    superAdmin?: UserView;
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
    posNumber?: string | null;
    attachmentUrl?: string | null;
    recipient?: ProjectInvoiceRecipientView;
    projectInvoiceItems?: Array<ProjectInvoiceItemView> | null;
};
