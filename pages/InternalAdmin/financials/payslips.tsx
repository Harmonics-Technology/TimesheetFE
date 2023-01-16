import { Box, Flex } from '@chakra-ui/react';
import PageTabs from '@components/bits-utils/PageTabs';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import AdminPayslip from '@components/subpages/AdminPayslip';
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
                    url="/InternalAdmin/financials/my-payslips"
                    tabName="My Payslips"
                />
                <PageTabs
                    url="/InternalAdmin/financials/payslips"
                    tabName="All Payslips"
                />
            </Flex>
            <AdminPayslip payrolls={payrolls} />
        </Box>
    );
}

export default expenses;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const data = await FinancialService.listPaySlips(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                pagingOptions.date,
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
