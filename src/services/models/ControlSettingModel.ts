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
    weeklyBeginingPeriodDate?: string | null;
    weeklyPaymentPeriod?: number | null;
    biWeeklyBeginingPeriodDate?: string | null;
    biWeeklyPaymentPeriod?: number | null;
    isMonthlyPayScheduleFullMonth?: boolean;
    montlyBeginingPeriodDate?: string | null;
    monthlyPaymentPeriod?: number | null;
    timesheetFillingReminderDay?: number | null;
    timesheetOverdueReminderDay?: number | null;
    allowUsersTofillFutureTimesheet?: boolean | null;
    adminCanApproveExpense?: boolean | null;
    adminCanApproveTimesheet?: boolean | null;
    adminCanApprovePayrolls?: boolean | null;
    adminCanViewPayrolls?: boolean | null;
    adminCanViewTeamMemberInvoice?: boolean | null;
    adminCanViewPaymentPartnerInvoice?: boolean | null;
    adminCanViewClientInvoice?: boolean | null;
};
