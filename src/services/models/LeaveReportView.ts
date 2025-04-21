/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AbsenteeismAndAttendanceReport } from './AbsenteeismAndAttendanceReport';
import type { EmployeeLeaveReportView } from './EmployeeLeaveReportView';
import type { LeaveDepartmentReportView } from './LeaveDepartmentReportView';
import type { LeaveRequestApprovalReportView } from './LeaveRequestApprovalReportView';
import type { LeaveTypeRate } from './LeaveTypeRate';
import type { LeaveUtilizationPerMonth } from './LeaveUtilizationPerMonth';

export type LeaveReportView = {
    noOfLeaveAllocated?: number;
    noOfLeaveTaken?: number;
    noOfLeaveRemaining?: number;
    noOfUnpaidLeave?: number;
    pendingLeaveRequest?: number;
    leaveUtilizationRate?: number;
    leaveUtilizationPerMonth?: Array<LeaveUtilizationPerMonth> | null;
    leaveTypeRateData?: LeaveTypeRate;
    leaveDepartmentReportmentData?: Array<LeaveDepartmentReportView> | null;
    employeeLeaveReportData?: Array<EmployeeLeaveReportView> | null;
    leaveRequestApprovalReportData?: Array<LeaveRequestApprovalReportView> | null;
    absenteeismAndAttendanceReportData?: Array<AbsenteeismAndAttendanceReport> | null;
};
