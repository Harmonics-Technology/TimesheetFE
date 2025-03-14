/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { StrippedUserView } from './StrippedUserView';

export type TimbaUserView = {
    userId?: string;
    user?: StrippedUserView;
    superAdminId?: string;
    superAdmin?: StrippedUserView;
    isActive?: boolean;
    firstName?: string | null;
    lastName?: string | null;
    jobTitle?: string | null;
    address?: string | null;
    isSendingInvoice?: boolean;
    phoneNumber?: string | null;
    clientSubscriptionId?: string;
};
