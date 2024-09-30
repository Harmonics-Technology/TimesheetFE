/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type LeaveConfigurationView = {
    id?: string;
    superAdminId?: string | null;
    eligibleLeaveDays?: number;
    isStandardEligibleDays?: boolean;
    isProrated?: boolean;
    allowRollover?: boolean;
    noOfMonthValid?: number | null;
};
