import { Box, Flex } from '@chakra-ui/react';
import PageTabs from '@components/bits-utils/PageTabs';
import { UserContext } from '@components/context/UserContext';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import AdminInvoices from '@components/subpages/AdminInvoices';
import OnshoreSubmittedInvoice from '@components/subpages/OnshoreSubmittedInvoice';
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
    const { user, subType } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    return (
        <Box>
            <Flex>
                <PageTabs
                    url={`/${role}/financials/invoices-team`}
                    tabName="Team Members"
                />
                <PageTabs
                    url={`/${role}/financials/invoices-payment`}
                    tabName="Payment Partners"
                    upgrade={subType == 'basic'}
                />
                <PageTabs
                    url={`/${role}/financials/invoices-client`}
                    tabName="Clients"
                    upgrade={subType !== 'premium'}
                />
            </Flex>
            <OnshoreSubmittedInvoice
                invoiceData={invoiceData}
                fileName="Team Member Pending Approval Invoice"
                record={3}
            />
        </Box>
    );
}

export default Invoices;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await FinancialService.listSubmittedOnshoreInvoices(
                pagingOptions.offset,
                pagingOptions.limit,
                superAdminId,
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
            return {
                props: {
                    data: [],
                },
            };
        }
    },
);
