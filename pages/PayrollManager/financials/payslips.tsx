import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import AdminPayslip from '@components/subpages/AdminPayslip';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    AdminPaymentScheduleViewListStandardResponse,
    FinancialService,
    PaySlipService,
    PayslipUserViewPagedCollectionStandardResponse,
} from 'src/services';

interface PayrollType {
    payrolls: PayslipUserViewPagedCollectionStandardResponse;
    paymentSchedule: AdminPaymentScheduleViewListStandardResponse;
}
function expenses({ payrolls, paymentSchedule }: PayrollType) {
    return (
        <AdminPayslip
            payrolls={payrolls}
            paymentSchedule={paymentSchedule}
            record={1}
            fileName="Payslip"
        />
    );
}

export default expenses;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await PaySlipService.getAllPaySlips(
                pagingOptions.offset,
                pagingOptions.limit,
                superAdminId,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
                pagingOptions.paySlipFilter,
            );
            const paymentSchedule = await FinancialService.getPaymentSchedules(
                superAdminId,
            );

            return {
                props: {
                    payrolls: data,
                    paymentSchedule,
                },
            };
        } catch (error: any) {
            return {
                props: {
                    data: [],
                },
            };
        }
    },
);
