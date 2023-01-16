import { Box, Flex } from '@chakra-ui/react';
import PageTabs from '@components/bits-utils/PageTabs';
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
        <Box>
            <Flex>
                <PageTabs
                    url="/InternalSupervisor/financials/expenses"
                    tabName="Team Members Expenses"
                />
                <PageTabs
                    url="/InternalSupervisor/financials/my-expense"
                    tabName="My Expenses"
                />
            </Flex>
            <ExpenseManagement
                expenses={expenses}
                team={team}
                expenseType={expenseType}
            />
        </Box>
    );
}

export default expenses;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const team = await UserService.getSupervisees();
            const expenseType = await SettingsService.listExpenseTypes();
            const data = await FinancialService.listSuperviseesExpenses(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
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
