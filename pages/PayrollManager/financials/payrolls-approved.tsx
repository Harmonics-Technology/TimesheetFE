import { Box, Flex } from '@chakra-ui/react';
import PageTabs from '@components/bits-utils/PageTabs';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import AdminInvoices from '@components/subpages/AdminInvoices';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    FinancialService,
    InvoiceViewPagedCollectionStandardResponse,
} from 'src/services';

interface InvoiceType {
    invoiceData: InvoiceViewPagedCollectionStandardResponse;
}
function payrolls({ invoiceData }: InvoiceType) {
    return (
        <Box>
            <Flex>
                <PageTabs
                    url="/PayrollManager/financials/payrolls"
                    tabName="Onshore"
                />
                <PageTabs
                    url="/PayrollManager/financials/payrolls-approved"
                    tabName="Offshore"
                />
            </Flex>
            <AdminInvoices invoiceData={invoiceData} />
        </Box>
    );
}

export default payrolls;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const data = await FinancialService.listSubmittedOffshoreInvoices(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                pagingOptions.date,
            );

            return {
                props: {
                    invoiceData: data,
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
