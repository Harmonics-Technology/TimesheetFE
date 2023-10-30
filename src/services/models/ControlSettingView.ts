/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ControlSettingView = {
    twoFactorEnabled?: boolean;
    adminOBoarding?: boolean;
    adminContractManagement?: boolean;
    adminLeaveManagement?: boolean;
    adminShiftManagement?: boolean;
    adminReport?: boolean;
    adminExpenseTypeAndHST?: boolean;
    allowShiftSwapRequest?: boolean;
    allowShiftSwapApproval?: boolean;
    allowIneligibleLeaveCode?: boolean;
    weeklyBeginingPeriodDate?: string | null;
    weeklyPaymentPeriod?: number | null;
    biWeeklyBeginingPeriodDate?: string | null;
    biWeeklyPaymentPeriod?: number | null;
    isMonthlyPayScheduleFullMonth?: boolean;
    montlyBeginingPeriodDate?: string | null;
    monthlyPaymentPeriod?: number | null;
    timesheetFillingReminderDay?: number | null;
    timesheetOverdueReminderDay?: number | null;
    allowUsersTofillFutureTimesheet?: boolean;
    adminCanApproveExpense?: boolean;
    adminCanApproveTimesheet?: boolean;
    adminCanApprovePayrolls?: boolean;
    adminCanViewPayrolls?: boolean;
    adminCanViewTeamMemberInvoice?: boolean;
    adminCanViewPaymentPartnerInvoice?: boolean;
    adminCanViewClientInvoice?: boolean;
};
