/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ControlSettingModel = {
    superAdminId?: string;
    twoFactorEnabled?: boolean | null;
    adminOBoarding?: boolean | null;
    adminContractManagement?: boolean | null;
    adminLeaveManagement?: boolean | null;
    adminShiftManagement?: boolean | null;
    adminReport?: boolean | null;
    adminExpenseTypeAndHST?: boolean | null;
    allowShiftSwapRequest?: boolean | null;
    allowShiftSwapApproval?: boolean | null;
    allowIneligibleLeaveCode?: boolean | null;
};
