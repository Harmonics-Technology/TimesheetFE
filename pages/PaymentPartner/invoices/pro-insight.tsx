import { Box, Flex } from '@chakra-ui/react';
import PageTabs from '@components/bits-utils/PageTabs';
import { UserContext } from '@components/context/UserContext';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import AdminPayroll from '@components/subpages/AdminPayroll';
import PaymentPartnerInvoice from '@components/subpages/PaymentPartnerInvoice';
import PaymentPartnerPayroll from '@components/subpages/PaymentPartnerPayroll';
import { GetServerSideProps } from 'next';
import React, { useContext } from 'react';
import {
    FinancialService,
    InvoiceViewPagedCollectionStandardResponse,
} from 'src/services';

interface PayrollType {
    invoice: InvoiceViewPagedCollectionStandardResponse;
}
function expenses({ invoice }: PayrollType) {
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    return (
        <Box>
            <Flex>
                <PageTabs
                    url={`/${role}/invoices/pro-insight`}
                    tabName="Pro-insight consulting"
                />
                <PageTabs
                    url={`/${role}/invoices/olade`}
                    tabName="Olade Consulting"
                />
            </Flex>
            <PaymentPartnerInvoice invoiceData={invoice} />
        </Box>
    );
}

export default expenses;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const data = await FinancialService.listInvoicesByPaymentPartner(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                pagingOptions.clientId,
                pagingOptions.from,
                pagingOptions.to,
            );
            return {
                props: {
                    invoice: data,
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
