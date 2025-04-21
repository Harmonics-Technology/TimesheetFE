/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BillablevNonBillableHoursReportView } from './BillablevNonBillableHoursReportView';
import type { DepartmentTimesheetReportView } from './DepartmentTimesheetReportView';
import type { EmployeeSummaryTimesheetReportView } from './EmployeeSummaryTimesheetReportView';

export type TimesheetReportView = {
    totalHours?: number;
    approvedHours?: number;
    pendingHours?: number;
    overtimeHours?: number;
    leaveHours?: number;
    departmentTimesheetReport?: Array<DepartmentTimesheetReportView> | null;
    employeeSummaryTimesheetReport?: Array<EmployeeSummaryTimesheetReportView> | null;
    billablevNonBillableHoursReport?: Array<BillablevNonBillableHoursReportView> | null;
};
