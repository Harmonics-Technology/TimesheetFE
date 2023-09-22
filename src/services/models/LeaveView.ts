/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EmployeeInformationView } from './EmployeeInformationView';
import type { LeaveTypeView } from './LeaveTypeView';
import type { UserView } from './UserView';

export type LeaveView = {
    id?: string;
    employeeInformationId?: string;
    employeeInformation?: EmployeeInformationView;
    leaveTypeId?: string;
    leaveType?: LeaveTypeView;
    startDate?: string | null;
    endDate?: string | null;
    approvalDate?: string;
    dateCreated?: string;
    reasonForLeave?: string | null;
    workAssigneeId?: string | null;
    workAssignee?: UserView;
    status?: string | null;
    leaveDaysEarned?: number;
    isCanceled?: boolean;
};
