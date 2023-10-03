import { Box, Flex } from '@chakra-ui/react';
import PageTabs from '@components/bits-utils/PageTabs';
import { UserContext } from '@components/context/UserContext';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import TeamExpenses from '@components/subpages/TeamExpenses';
import { GetServerSideProps } from 'next';
import React, { useContext } from 'react';
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
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');

    return (
        <Box>
            <Flex>
                <PageTabs
                    url={`/${role}/financials/expenses`}
                    tabName="Team Members Expenses"
                />
                <PageTabs
                    url={`/${role}/financials/my-expenses`}
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
        try {
            const expenseType = await SettingsService.listExpenseTypes();
            const data = await FinancialService.listExpenses(
                pagingOptions.offset,
                pagingOptions.limit,
                employeeId,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
            );
            // const data = await SettingsService.listExpenseTypes();

            return {
                props: {
                    expenses: data,
                    expenseType: expenseType.data,
                    id,
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
