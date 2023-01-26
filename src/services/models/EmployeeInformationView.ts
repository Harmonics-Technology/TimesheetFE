/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ContractView } from './ContractView';
import type { UserView } from './UserView';

export type EmployeeInformationView = {
    id?: string;
    userId?: string;
    user?: UserView;
    clientId?: string | null;
    client?: UserView;
    supervisorId?: string;
    supervisor?: UserView;
    payrollType?: string | null;
    ratePerHour?: number;
    jobTitle?: string | null;
    hoursPerDay?: number;
    inCorporationDocumentUrl?: string | null;
    voidCheckUrl?: string | null;
    insuranceDocumentUrl?: string | null;
    hstNumber?: number;
    paymentPartnerId?: string | null;
    paymentPartner?: UserView;
    paymentRate?: string | null;
    currency?: string | null;
    fixedAmount?: boolean;
    clientRate?: number | null;
    monthlyPayoutRate?: number | null;
    paymentFrequency?: string | null;
    contracts?: Array<ContractView> | null;
    dateCreated?: string;
};
