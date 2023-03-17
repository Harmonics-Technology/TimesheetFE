/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RecentTimeSheetView } from './RecentTimeSheetView';

export type DashboardTeamMemberView = {
    approvedTimeSheet?: number;
    awaitingTimeSheet?: number;
    rejectedTimeSheet?: number;
    recentTimeSheet?: Array<RecentTimeSheetView> | null;
};
