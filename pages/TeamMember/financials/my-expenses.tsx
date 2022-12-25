import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import TeamExpenses from '@components/subpages/TeamExpenses';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ExpenseTypeView,
    ExpenseViewPagedCollectionStandardResponse,
    FinancialService,
    SettingsService,
    UserService,
    UserView,
} from 'src/services';

interface ExpensesType {
    expenses: ExpenseViewPagedCollectionStandardResponse;
    id: string;
    expenseType: ExpenseTypeView[];
}
function expenses({ expenses, id, expenseType }: ExpensesType) {
    console.log({ id });
    return (
        <TeamExpenses expenses={expenses} id={id} expenseType={expenseType} />
    );
}

export default expenses;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const id = JSON.parse(ctx.req.cookies.user).id;
        const employeeId = JSON.parse(
            ctx.req.cookies.user,
        ).employeeInformationId;
        try {
            const expenseType = await SettingsService.listExpenseTypes();
            const data = await FinancialService.listExpenses(
                pagingOptions.offset,
                pagingOptions.limit,
                employeeId,
                pagingOptions.search,
            );
            // const data = await SettingsService.listExpenseTypes();

            console.log({ data });
            return {
                props: {
                    expenses: data,
                    expenseType: expenseType.data,
                    id,
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
