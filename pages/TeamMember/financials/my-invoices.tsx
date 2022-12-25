import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import TeamInvoices from '@components/subpages/TeamInvoices';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    FinancialService,
    PayrollViewPagedCollectionStandardResponse,
} from 'src/services';

interface PayrollType {
    payrolls: PayrollViewPagedCollectionStandardResponse;
}
function payslips({ payrolls }: PayrollType) {
    return <TeamInvoices adminList={payrolls} />;
}

export default payslips;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const id = JSON.parse(ctx.req.cookies.user).employeeInformationId;
        try {
            const data = await FinancialService.listPaySlips(
                pagingOptions.offset,
                pagingOptions.limit,
                id,
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
