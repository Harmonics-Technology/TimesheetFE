import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import TeamPayslips from '@components/subpages/TeamPayslips';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    FinancialService,
    PaySlipService,
    PaySlipViewPagedCollectionStandardResponse,
} from 'src/services';

interface PayrollType {
    payrolls: PaySlipViewPagedCollectionStandardResponse;
}
function payslips({ payrolls }: PayrollType) {
    return <TeamPayslips payrolls={payrolls} />;
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

            return {
                props: {
                    payrolls: data,
                },
            };
        } catch (error: any) {
            console.log(error);
            return {
                props: {
                    data: [],
                },
            };
        }
    },
);
