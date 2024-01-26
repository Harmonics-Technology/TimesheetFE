/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UserDraftModel = {
    id?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    address?: string | null;
    dateOfBirth?: string | null;
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
    superAdminId: string;
    payRollTypeId?: number | null;
    payrollGroupId?: number | null;
    supervisorId?: string | null;
    ratePerHour?: number | null;
    jobTitle?: string | null;
    hoursPerDay?: number | null;
    inCorporationDocumentUrl?: string | null;
    voidCheckUrl?: string | null;
    insuranceDocumentUrl?: string | null;
    hstNumber?: number | null;
    paymentPartnerId?: string | null;
    paymentRate?: string | null;
    currency?: string | null;
    fixedAmount?: boolean | null;
    title?: string | null;
    startDate?: string | null;
    endDate?: string | null;
    document?: string | null;
    clientRate?: number | null;
    monthlyPayoutRate?: number | null;
    paymentFrequency?: string | null;
    isActive?: boolean | null;
    onBoradingFee?: number | null;
    isEligibleForLeave?: boolean | null;
    numberOfDaysEligible?: number | null;
    numberOfHoursEligible?: number | null;
    employeeType?: string | null;
    invoiceGenerationType?: string | null;
    enableFinancials?: boolean | null;
};