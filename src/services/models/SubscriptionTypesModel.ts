/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type SubscriptionTypesModel = {
    id?: string | null;
    name?: string | null;
    description?: string | null;
    recommendedFor?: string | null;
    features?: string | null;
    monthlyAmount?: number;
    monthlyDiscount?: number | null;
    yearlyAmount?: number;
    yearlyDiscount?: number;
    totalMonthlyAmount?: number;
    totalYearlyAmount?: number;
    hasFreeTrial?: boolean;
    freeTrialDuration?: number | null;
    discountType?: string | null;
};
