import { Box, Flex } from '@chakra-ui/react';
import PageTabs from '@components/bits-utils/PageTabs';
import { UserContext } from '@components/context/UserContext';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import TeamPayslips from '@components/subpages/TeamPayslips';
import { GetServerSideProps } from 'next';
import React, { useContext } from 'react';
import {
    FinancialService,
    PayslipUserViewPagedCollectionStandardResponse,
} from 'src/services';

interface PayrollType {
    payrolls: PayslipUserViewPagedCollectionStandardResponse;
}
function payslips({ payrolls }: PayrollType) {
    const { user } = useContext(UserContext);
    const role = user?.role.replace(' ', '');
    return (
        <Box>
            <Flex>
                <PageTabs
                    url={`/${role}/financials/my-payslips`}
                    tabName="My Payslips"
                />
                <PageTabs
                    url={`/${role}/financials/payslips`}
                    tabName="All Payslips"
                />
            </Flex>
            <TeamPayslips payrolls={payrolls} />
        </Box>
    );
}

export default payslips;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const id = JSON.parse(ctx.req.cookies.user).employeeInformationId;
        try {
            const data = await FinancialService.listPaySlipsByTeamMember(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
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
