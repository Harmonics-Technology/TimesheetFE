/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ClientSubscriptionResponseViewModel } from './ClientSubscriptionResponseViewModel';
import type { ControlSettingView } from './ControlSettingView';
import type { EmployeeInformationView } from './EmployeeInformationView';

export type UserView = {
    id?: string;
    employeeInformationId?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    fullName?: string | null;
    token?: string | null;
    email?: string | null;
    profilePicture?: string | null;
    role?: string | null;
    isActive?: boolean;
    address?: string | null;
    dateOfBirth?: string;
    employeeInformation?: EmployeeInformationView;
    clientId?: string | null;
    client?: UserView;
    superAdminId?: string | null;
    phoneNumber?: string | null;
    organizationName?: string | null;
    organizationEmail?: string | null;
    organizationPhone?: string | null;
    organizationAddress?: string | null;
    clientName?: string | null;
    payrollType?: string | null;
    payrollGroup?: string | null;
    payrollGroupId?: number;
    invoiceGenerationFrequency?: string | null;
    term?: number | null;
    twoFactorCode?: string;
    twoFactorEnabled?: boolean;
    numberOfDaysEligible?: number | null;
    numberOfLeaveDaysTaken?: number | null;
    numberOfHoursEligible?: number | null;
    employeeType?: string | null;
    hoursPerDay?: number | null;
    invoiceGenerationType?: string | null;
    controlSettingView?: ControlSettingView;
    subscriptiobDetails?: ClientSubscriptionResponseViewModel;
};
