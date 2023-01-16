import { Box, Flex } from '@chakra-ui/react';
import PageTabs from '@components/bits-utils/PageTabs';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import TeamPayslips from '@components/subpages/TeamPayslips';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    FinancialService,
    PayrollViewPagedCollectionStandardResponse,
} from 'src/services';

interface PayrollType {
    payrolls: PayrollViewPagedCollectionStandardResponse;
}
function payslips({ payrolls }: PayrollType) {
    return (
        <Box>
            <Flex>
                <PageTabs
                    url="/InternalAdmin/financials/my-payslips"
                    tabName="My Payslips"
                />
                <PageTabs
                    url="/InternalAdmin/financials/payslips"
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
