import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import ExpenseType from '@components/subpages/ExpenseType';
import { GetServerSideProps } from 'next';
import React from 'react';
import { ExpenseTypeView, SettingsService } from 'src/services';

interface expenseProps {
    expenses: ExpenseTypeView[];
}
function expensetype({ expenses }: expenseProps) {
    return <ExpenseType expenses={expenses} />;
}

export default expensetype;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await SettingsService.listExpenseTypes(superAdminId);
            return {
                props: {
                    expenses: data.data,
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
