/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { InvoiceView } from './InvoiceView';
import type { PaySlipView } from './PaySlipView';
import type { TimeSheetHistoryView } from './TimeSheetHistoryView';
import type { UserView } from './UserView';

export type DashboardView = {
    totalClients?: number;
    totalTeamMembers?: number;
    totalDownLines?: number;
    recentCLients?: Array<UserView> | null;
    recentPayrolls?: Array<InvoiceView> | null;
    recentInvoiced?: Array<InvoiceView> | null;
    recentPayslips?: Array<PaySlipView> | null;
    recentTimeSheet?: Array<TimeSheetHistoryView> | null;
};
