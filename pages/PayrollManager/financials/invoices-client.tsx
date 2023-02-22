import { Box, Flex } from '@chakra-ui/react';
import PageTabs from '@components/bits-utils/PageTabs';
import { UserContext } from '@components/context/UserContext';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import AdminInvoices from '@components/subpages/AdminInvoices';
import { GetServerSideProps } from 'next';
import React, { useContext } from 'react';
import {
    FinancialService,
    InvoiceViewPagedCollectionStandardResponse,
} from 'src/services';

interface invoiceType {
    invoiceData: InvoiceViewPagedCollectionStandardResponse;
}
function Invoices({ invoiceData }: invoiceType) {
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    return (
        <Box>
            <Flex>
                {/* <PageTabs
                    url={`/${role}/financials/invoices`}
                    tabName="Team Members"
                /> */}
                <PageTabs
                    url={`/${role}/financials/invoices`}
                    tabName="Payment Partners"
                />
                <PageTabs
                    url={`/${role}/financials/invoices-client`}
                    tabName="Clients"
                />
            </Flex>
            <AdminInvoices invoiceData={invoiceData} />
        </Box>
    );
}

export default Invoices;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const data = await FinancialService.listAllClientInvoices(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
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
