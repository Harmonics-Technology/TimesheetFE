/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import { OnboardingFeeRegisterModel } from "./OnboardingFeeRegisterModel";


export type TeamMemberModel = {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    password?: string | null;
    address?: string | null;
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
    draftId?: string | null;
    onboardingFees?: Array<OnboardingFeeRegisterModel> | null;
    id?: string;
    payRollTypeId?: number;
    payrollGroupId?: number | null;
    supervisorId?: string | null;
    clientId?: string | null;
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
    onBoradingFee?: number;
    isEligibleForLeave?: boolean | null;
    numberOfDaysEligible?: number | null;
    numberOfHoursEligible?: number | null;
    employeeType?: string | null;
    superAdminId?: string | null;
    invoiceGenerationType?: string | null;
    enableFinancials?: boolean;
    department?: string | null;
    employmentContractType?: string | null;
    timesheetFrequency?: string | null;
    payrollStructure?: string | null;
    rate?: number;
    rateType?: string | null;
    taxType?: string | null;
    standardCanadianSystem?: string | null;
    tax?: number;
    payrollProcessingType?: string | null;
    paymentProcessingFeeType?: string | null;
    paymentProcessingFee?: number;
};
