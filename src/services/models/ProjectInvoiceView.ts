/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ProjectView } from './ProjectView';

export type ProjectInvoiceView = {
    superAdminId?: string;
    projectId?: string;
    project?: ProjectView;
    invoiceReference?: string | null;
    subtotal?: number;
    hst?: number;
    total?: number;
    notes?: string | null;
    issuedDate?: string;
    dueDate?: string;
    status?: string | null;
    organization?: string | null;
};
