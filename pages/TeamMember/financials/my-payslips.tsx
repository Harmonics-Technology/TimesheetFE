import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import TeamPayslips from '@components/subpages/TeamPayslips';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    FinancialService,
    PaySlipService,
    PaySlipViewPagedCollectionStandardResponse,
    PaymentScheduleListStandardResponse,
} from 'src/services';

interface PayrollType {
    payrolls: PaySlipViewPagedCollectionStandardResponse;
    paymentSchedule: PaymentScheduleListStandardResponse;
}
function payslips({ payrolls, paymentSchedule }: PayrollType) {
    return (
        <TeamPayslips payrolls={payrolls} paymentSchedule={paymentSchedule} />
    );
}

export default payslips;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const id = JSON.parse(ctx.req.cookies.user).employeeInformationId;
        try {
            const data = await PaySlipService.getTeamMembersPaySlips(
                id,
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
            );
            const paymentSchedule =
                await FinancialService.getEmployeePaymentSchedule(id);

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
