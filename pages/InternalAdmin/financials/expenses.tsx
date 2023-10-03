import { Box, Flex } from '@chakra-ui/react';
import PageTabs from '@components/bits-utils/PageTabs';
import { UserContext } from '@components/context/UserContext';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import PayrollExpenseManagement from '@components/subpages/PayrollExpenseManagement';
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
    team: UserView[];
    expenseType: ExpenseTypeView[];
}
function expenses({ expenses, team, expenseType }: ExpensesType) {
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    return (
        <Box>
            <Flex>
                <PageTabs
                    url={`/${role}/financials/expenses`}
                    tabName="Reviewed"
                />
                <PageTabs
                    url={`/${role}/financials/expenses-approved`}
                    tabName="Approved"
                />
                {/* <PageTabs
                    url={`/${role}/financials/my-expenses`}
                    tabName="My Expenses"
                /> */}
            </Flex>
            <PayrollExpenseManagement
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
            const team = await UserService.listUsers('Team Member');
            const expenseType = await SettingsService.listExpenseTypes();
            const data = await FinancialService.listReviewedExpenses(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
            );
            // const data = await SettingsService.listExpenseTypes();

            return {
                props: {
                    expenses: data,
                    team: team?.data?.value,
                    expenseType: expenseType.data,
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
