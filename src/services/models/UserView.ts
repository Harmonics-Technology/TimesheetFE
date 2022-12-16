/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

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
    phoneNumber?: string | null;
    organizationName?: string | null;
    organizationEmail?: string | null;
    organizationPhone?: string | null;
    organizationAddress?: string | null;
};
