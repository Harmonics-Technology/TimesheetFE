/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SubscriptionClientDetail } from './SubscriptionClientDetail';
import type { SubscriptionDetail } from './SubscriptionDetail';

export type SubscriptionValue = {
    id?: string | null;
    clientId?: string | null;
    client?: SubscriptionClientDetail;
    freeTrialStartDate?: string | null;
    startDate?: string;
    duration?: number;
    subscriptionId?: string | null;
    subscription?: SubscriptionDetail;
    annualBilling?: boolean;
    status?: string | null;
    endDate?: string;
    totalAmount?: number;
    isCanceled?: boolean;
    cancelationReason?: string | null;
    numberOfLicense?: number;
};
