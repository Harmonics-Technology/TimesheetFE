/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AddOnSubscription = {
    id?: string | null;
    subscriptionTypeId?: number;
    subscriptionType?: any;
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
    addonAmount?: number | null;
    hasFreeTrial?: boolean;
    freeTrialDuration?: any;
    discountType?: string | null;
};
