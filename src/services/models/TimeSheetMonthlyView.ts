/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TimeSheetView } from './TimeSheetView';

export type TimeSheetMonthlyView = {
    timeSheet?: Array<TimeSheetView> | null;
    expectedPay?: number | null;
    expectedWorkHours?: number;
};
