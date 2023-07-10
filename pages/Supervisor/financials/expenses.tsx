import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import ExpenseManagement from '@components/subpages/ExpenseManagement';
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
    team: UserView[];
    expenseType: ExpenseTypeView[];
}
function expenses({ expenses, team, expenseType }: ExpensesType) {
    return (
        <ExpenseManagement
            expenses={expenses}
            team={team}
            expenseType={expenseType}
        />
    );
}

export default expenses;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const team = await UserService.getSupervisees(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                superAdminId,
            );
            const expenseType = await SettingsService.listExpenseTypes(
                superAdminId,
            );
            const data = await FinancialService.listSuperviseesExpenses(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
            );
            // const data = await SettingsService.listExpenseTypes();

            console.log({ team, expenseType, data });
            return {
                props: {
                    expenses: data,
                    //@ts-ignore
                    team: team?.data?.value,
                    expenseType: expenseType.data,
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
