import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import AdminPayroll from '@components/subpages/AdminPayroll';
import PaymentPartnerPayroll from '@components/subpages/PaymentPartnerPayroll';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    FinancialService,
    PayrollViewPagedCollectionStandardResponse,
} from 'src/services';

interface PayrollType {
    payrolls: PayrollViewPagedCollectionStandardResponse;
}
function expenses({ payrolls }: PayrollType) {
    return <PaymentPartnerPayroll payrolls={payrolls} />;
}

export default expenses;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const data = await FinancialService.listPayrollsByPaymentPartner(
                pagingOptions.offset,
                pagingOptions.limit,
                // pagingOptions.search,
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
