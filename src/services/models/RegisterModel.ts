/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type RegisterModel = {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    password?: string | null;
    address?: string | null;
    dateOfBirth?: string;
    clientId?: string | null;
    role: string;
    phoneNumber?: string | null;
    organizationName?: string | null;
    organizationEmail?: string | null;
    organizationPhone?: string | null;
    organizationAddress?: string | null;
    invoiceGenerationFrequency?: string | null;
    term?: number | null;
    clientSubscriptionId?: string | null;
    commandCenterClientId?: string | null;
    superAdminId?: string | null;
};
