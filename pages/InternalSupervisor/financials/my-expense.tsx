import { Box, Flex } from '@chakra-ui/react';
import PageTabs from '@components/bits-utils/PageTabs';
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
} from 'src/services';

interface ExpensesType {
    expenses: ExpenseViewPagedCollectionStandardResponse;
    id: string;
    expenseType: ExpenseTypeView[];
}
function expenses({ expenses, id, expenseType }: ExpensesType) {
    console.log({ id });
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
            <TeamExpenses
                expenses={expenses}
                id={id}
                expenseType={expenseType}
            />
        </Box>
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
        // console.log({ employeeId });
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
