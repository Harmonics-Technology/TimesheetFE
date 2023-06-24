/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AddOn } from './AddOn';
import type { BaseSubscription } from './BaseSubscription';

export type Data = {
    id?: string | null;
    clientId?: string | null;
    client?: any;
    freeTrialStartDate?: any;
    startDate?: string;
    duration?: number;
    baseSubscriptionId?: string | null;
    baseSubscription?: BaseSubscription;
    annualBilling?: boolean;
    status?: string | null;
    endDate?: string;
    totalAmount?: number;
    addOns?: Array<AddOn> | null;
};
