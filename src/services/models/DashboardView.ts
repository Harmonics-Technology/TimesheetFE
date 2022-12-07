/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserView } from './UserView';

export type DashboardView = {
    totalClients?: number;
    totalTeamMembers?: number;
    totalDownLines?: number;
    recentCLients?: Array<UserView> | null;
};
