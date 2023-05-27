/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RejectTimeSheetData } from './RejectTimeSheetData';

export type RejectTimesheetModel = {
    timeSheets?: Array<RejectTimeSheetData> | null;
    reason?: string | null;
};
