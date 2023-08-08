/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SubscriptionDetail = {
    id?: string | null;
    name?: string | null;
    description?: string | null;
    recommendedFor?: string | null;
    features?: string | null;
    monthlyAmount?: number;
    monthlyDiscount?: number | null;
    yearlyAmount?: number;
    yearlyDiscount?: number | null;
    totalMonthlyAmount?: number;
    totalYearlyAmount?: number;
    hasFreeTrial?: boolean;
    freeTrialDuration?: string | null;
    discountType?: string | null;
};
