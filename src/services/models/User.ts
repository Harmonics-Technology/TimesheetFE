/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EmployeeInformation } from './EmployeeInformation';

export type User = {
    id?: string;
    userName?: string | null;
    normalizedUserName?: string | null;
    email?: string | null;
    normalizedEmail?: string | null;
    emailConfirmed?: boolean;
    passwordHash?: string | null;
    securityStamp?: string | null;
    concurrencyStamp?: string | null;
    phoneNumber?: string | null;
    phoneNumberConfirmed?: boolean;
    twoFactorEnabled?: boolean;
    lockoutEnd?: string | null;
    lockoutEnabled?: boolean;
    accessFailedCount?: number;
    firstName: string;
    lastName: string;
    readonly fullName?: string | null;
    otherNames?: string | null;
    dateOfBirth?: string;
    password?: string | null;
    token?: string | null;
    profilePicture?: string | null;
    role?: string | null;
    address?: string | null;
    organizationName?: string | null;
    organizationEmail?: string | null;
    organizationPhone?: string | null;
    organizationAddress?: string | null;
    clientId?: string | null;
    client?: User;
    superAdminId?: string | null;
    superAdmin?: User;
    dateCreated?: string;
    dateModified?: string;
    isActive?: boolean;
    employeeInformationId?: string | null;
    employeeInformation?: EmployeeInformation;
    invoiceGenerationFrequency?: string | null;
    term?: number | null;
    createdById?: string | null;
    createdBy?: User;
    twoFactorCode?: string | null;
    clientSubscriptionId?: string | null;
    clientSubscriptionStatus?: boolean | null;
    commandCenterClientId?: string | null;
    leaveConfigurationId?: string | null;
    controlSettingId?: string | null;
    supervisors?: Array<User> | null;
    usersCreatedByYou?: Array<User> | null;
    supervisees?: Array<EmployeeInformation> | null;
    teamMembers?: Array<EmployeeInformation> | null;
    payees?: Array<EmployeeInformation> | null;
};
