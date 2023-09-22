import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import PayPartnerExpense from '@components/subpages/PayPartnerExpense';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ExpenseViewPagedCollectionStandardResponse,
    FinancialService,
} from 'src/services';

interface expenseProps {
    listExpenses: ExpenseViewPagedCollectionStandardResponse;
}
function expensetype({ listExpenses }: expenseProps) {
    return <PayPartnerExpense listExpenses={listExpenses} />;
}

export default expensetype;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const listExpenses =
                await FinancialService.listExpensesByPaymentPartner(
                    pagingOptions.offset,
                    pagingOptions.limit,
                    pagingOptions.search,
                    pagingOptions.from,
                    pagingOptions.to,
                );
            return {
                props: {
                    listExpenses,
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
