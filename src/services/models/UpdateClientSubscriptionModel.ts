/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UpdateClientSubscriptionModel = {
    commandCenterClientId?: string;
    clientSubscriptionId?: string;
    subscriptionStatus?: boolean;
    noOfLicense?: number;
    subscriptionType?: string | null;
    annualBilling?: boolean;
    totalAmount?: number;
    startDate?: string | null;
    endDate?: string | null;
    subscriptionPrice?: number;
};
