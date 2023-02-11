import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import AdminPayslip from '@components/subpages/AdminPayslip';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    FinancialService,
    PayslipUserViewPagedCollectionStandardResponse,
} from 'src/services';

interface PayrollType {
    payrolls: PayslipUserViewPagedCollectionStandardResponse;
}
function expenses({ payrolls }: PayrollType) {
    return <AdminPayslip payrolls={payrolls} />;
}

export default expenses;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const data = await FinancialService.listPaySlips(
                pagingOptions.offset,
                pagingOptions.limit,
                '',
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
