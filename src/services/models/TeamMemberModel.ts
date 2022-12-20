/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type TeamMemberModel = {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    password?: string | null;
    clientId?: string | null;
    role: string;
    phoneNumber?: string | null;
    organizationName?: string | null;
    organizationEmail?: string | null;
    organizationPhone?: string | null;
    organizationAddress?: string | null;
    id?: string;
    payRollTypeId?: number;
    supervisorId?: string | null;
    ratePerHour?: number;
    dateOfBirth?: string;
    jobTitle?: string | null;
    hoursPerDay?: number;
    inCorporationDocumentUrl?: string | null;
    voidCheckUrl?: string | null;
    insuranceDocumentUrl?: string | null;
    hstNumber?: number;
    paymentPartnerId?: string | null;
    paymentRate?: string | null;
    currency?: string | null;
    fixedAmount?: boolean;
    title?: string | null;
    startDate?: string;
    endDate?: string;
    document?: string | null;
    clientRate?: number | null;
    monthlyPayoutRate?: number | null;
    paymentFrequency?: string | null;
    isActive?: boolean;
};
