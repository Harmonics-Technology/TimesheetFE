/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PaymentSchedule = {
    id?: string;
    dateCreated?: string;
    dateModified?: string;
    cycle?: number;
    weekDate?: string;
    lastWorkDayOfCycle?: string;
    approvalDate?: string;
    paymentDate?: string;
    cycleType?: string | null;
};
