/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { PaymentSchedule } from './PaymentSchedule';

export type AdminPaymentScheduleView = {
    scheduleType?: string | null;
    schedules?: Array<PaymentSchedule> | null;
};
