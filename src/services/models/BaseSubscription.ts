/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type BaseSubscription = {
    id?: string | null;
    subscriptionTypeId?: number;
    subscriptionType?: any;
    name?: string | null;
    description?: string | null;
    recommendedFor?: string | null;
    features?: string | null;
    monthlyAmount?: number;
    monthlyDiscount?: number;
    yearlyAmount?: number;
    yearlyDiscount?: number;
    totalMonthlyAmount?: number;
    totalYearlyAmount?: number;
    addonAmount?: any;
    hasFreeTrial?: boolean;
    freeTrialDuration?: number;
    discountType?: string | null;
};
