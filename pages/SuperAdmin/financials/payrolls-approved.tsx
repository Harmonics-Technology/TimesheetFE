import { Box, Flex } from '@chakra-ui/react';
import PageTabs from '@components/bits-utils/PageTabs';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import AdminPayroll from '@components/subpages/AdminPayroll';
import AdminPayrollApproved from '@components/subpages/AdminPayrollApproved';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    FinancialService,
    PayrollViewPagedCollectionStandardResponse,
} from 'src/services';

interface PayrollType {
    payrolls: PayrollViewPagedCollectionStandardResponse;
}
function expenses({ payrolls }: PayrollType) {
    return (
        <Box>
            <Flex>
                <PageTabs
                    url="/SuperAdmin/financials/payrolls"
                    tabName="Awaiting Approval"
                />
                <PageTabs
                    url="/SuperAdmin/financials/payrolls-approved"
                    tabName="Approved"
                />
            </Flex>
            <AdminPayrollApproved payrolls={payrolls} />
        </Box>
    );
}

export default expenses;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const data = await FinancialService.listPayrolls(
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
