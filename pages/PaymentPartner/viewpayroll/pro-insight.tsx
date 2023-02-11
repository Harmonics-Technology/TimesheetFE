import { Box, Flex } from '@chakra-ui/react';
import PageTabs from '@components/bits-utils/PageTabs';
import { UserContext } from '@components/context/UserContext';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import AdminPayroll from '@components/subpages/AdminPayroll';
import PaymentPartnerPayroll from '@components/subpages/PaymentPartnerPayroll';
import { GetServerSideProps } from 'next';
import React, { useContext } from 'react';
import {
    FinancialService,
    InvoiceViewPagedCollectionStandardResponse,
} from 'src/services';

interface PayrollType {
    payrolls: InvoiceViewPagedCollectionStandardResponse;
    payrollGroupId: number;
}
function expenses({ payrolls, payrollGroupId }: PayrollType) {
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    return (
        <Box>
            <Flex>
                <PageTabs
                    url={`/${role}/viewpayroll/pro-insight`}
                    tabName="Pro-insight consulting"
                />
                <PageTabs
                    url={`/${role}/viewpayroll/Olade`}
                    tabName="Olade Consulting"
                />
            </Flex>
            <PaymentPartnerPayroll payrolls={payrolls} id={payrollGroupId} />
        </Box>
    );
}

export default expenses;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const payrollGroupId = 1;
        try {
            const data = await FinancialService.listPayrollGroupInvoices(
                payrollGroupId,
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
            );

            return {
                props: {
                    payrolls: data,
                    payrollGroupId,
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
