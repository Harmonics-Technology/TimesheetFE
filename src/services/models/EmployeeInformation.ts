/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Contract } from './Contract';
import type { PayRollType } from './PayRollType';
import type { User } from './User';

export type EmployeeInformation = {
    id?: string;
    dateCreated?: string;
    dateModified?: string;
    userId?: string;
    user?: User;
    payRollTypeId?: number;
    clientId?: string | null;
    client?: User;
    supervisorId?: string | null;
    supervisor?: User;
    payrollType?: PayRollType;
    ratePerHour?: number;
    jobTitle?: string | null;
    hoursPerDay?: number;
    inCorporationDocumentUrl?: string | null;
    voidCheckUrl?: string | null;
    insuranceDocumentUrl?: string | null;
    hstNumber?: number;
    paymentPartnerId?: string | null;
    paymentPartner?: User;
    paymentRate?: string | null;
    currency?: string | null;
    fixedAmount?: boolean;
    clientRate?: number | null;
    monthlyPayoutRate?: number | null;
    paymentFrequency?: string | null;
    onBoradingFee?: number;
    isEligibleForLeave?: boolean | null;
    numberOfDaysEligible?: number | null;
    numberOfHoursEligible?: number | null;
    numberOfEligibleLeaveDaysTaken?: number;
    employeeType?: string | null;
    invoiceGenerationType?: string | null;
    enableFinancials?: boolean;
    contracts?: Array<Contract> | null;
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
    isTrainingManager?: boolean;
    canManageAllTraining?: boolean;
};
