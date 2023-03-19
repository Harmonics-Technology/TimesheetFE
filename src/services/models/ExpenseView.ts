/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserView } from './UserView';

export type ExpenseView = {
    id?: string;
    teamMemberId?: string;
    teamMember?: UserView;
    description?: string | null;
    expenseType?: string | null;
    amount?: number;
    currency?: string | null;
    status?: string | null;
    dateCreated?: string;
    expenseDate?: string | null;
};
