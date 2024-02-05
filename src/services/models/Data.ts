/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Subscription } from './Subscription';

export type Data = {
    id?: string | null;
    clientId?: string | null;
    freeTrialStartDate?: any;
    onFreeTrial?: any;
    startDate?: string;
    duration?: number;
    subscriptionId?: string | null;
    subscription?: Subscription;
    annualBilling?: boolean;
    status?: string | null;
    endDate?: string;
    totalAmount?: number;
};
