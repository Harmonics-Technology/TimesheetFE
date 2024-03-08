/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { OnboardingFeeRegisterModel } from './OnboardingFeeRegisterModel';

export type UpdateUserModel = {
    id?: string;
    firstName?: string | null;
    lastName?: string | null;
    phoneNumber?: string | null;
    dateOfBirth?: string;
    address?: string | null;
    isActive?: boolean;
    role?: string | null;
    organizationName?: string | null;
    organizationEmail?: string | null;
    organizationPhone?: string | null;
    organizationAddress?: string | null;
    profilePicture?: string | null;
    invoiceGenerationFrequency?: string | null;
    term?: number | null;
    currency?: string | null;
    onboardingFees?: Array<OnboardingFeeRegisterModel> | null;
};
