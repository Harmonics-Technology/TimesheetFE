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
    contracts?: Array<Contract> | null;
};
