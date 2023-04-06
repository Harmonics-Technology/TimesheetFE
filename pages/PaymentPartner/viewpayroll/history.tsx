import { Box, Flex } from '@chakra-ui/react';
import PageTabs from '@components/bits-utils/PageTabs';
import { UserContext } from '@components/context/UserContext';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import AdminPayroll from '@components/subpages/AdminPayroll';
import PaymentPartnerPayroll from '@components/subpages/PaymentPartnerPayroll';
import PaymentPayrollHistory from '@components/subpages/PaymentPayrollHistory';
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
                    url={`/${role}/viewpayroll/olade`}
                    tabName="Olade Consulting"
                />
            </Flex>
            {/* <PaymentPartnerPayroll payrolls={payrolls} id={payrollGroupId} /> */}
            <PaymentPayrollHistory payrolls={payrolls} id={payrollGroupId} />
        </Box>
    );
}

export default expenses;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const payrollGroupId = 2;
        try {
            const data = await FinancialService.listPaymentPartnerInvoices(
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
            (error);
            return {
                props: {
                    data: [],
                },
            };
        }
    },
);
