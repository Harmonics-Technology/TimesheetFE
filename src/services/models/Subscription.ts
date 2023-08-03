/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Subscription = {
    id?: string | null;
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
    hasFreeTrial?: boolean;
    freeTrialDuration?: any;
    discountType?: any;
};
