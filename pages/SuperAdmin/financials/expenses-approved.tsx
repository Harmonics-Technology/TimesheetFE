import { Box, Flex } from '@chakra-ui/react';
import PageTabs from '@components/bits-utils/PageTabs';
import { UserContext } from '@components/context/UserContext';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import PayrollExpenseManagement from '@components/subpages/PayrollExpenseManagement';
import PayrollExpenseManagementApproved from '@components/subpages/PayrollExpenseManagementApproved';
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
                    tabName="Awaiting Approval"
                />
                <PageTabs
                    url={`/${role}/financials/expenses-approved`}
                    tabName="Approved"
                />
            </Flex>
            <PayrollExpenseManagementApproved
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
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const team = await UserService.listUsers(
                'Team Member',
                superAdminId,
            );
            const expenseType = await SettingsService.listExpenseTypes(
                superAdminId,
            );
            const data = await FinancialService.listAllApprovedExpenses(
                pagingOptions.offset,
                pagingOptions.limit,
                superAdminId,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
            );
            // const data = await SettingsService.listExpenseTypes();

            //
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
