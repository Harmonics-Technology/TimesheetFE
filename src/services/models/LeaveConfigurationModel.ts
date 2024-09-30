/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type LeaveConfigurationModel = {
    id?: string | null;
    superAdminId?: string | null;
    eligibleLeaveDays?: number | null;
    isStandardEligibleDays?: boolean | null;
    isProrated?: boolean | null;
    allowRollover?: boolean | null;
    noOfMonthValid?: number | null;
};
