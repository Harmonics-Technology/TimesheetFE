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
    UserService,
} from 'src/services';

interface invoiceType {
    invoiceData: InvoiceViewPagedCollectionStandardResponse;
    organizationCurrency: any;
}
function Invoices({ invoiceData, organizationCurrency }: invoiceType) {
    const { user, subType } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    return (
        <Box>
            <OnshoreSubmittedInvoice
                invoiceData={invoiceData}
                record={4}
                fileName="Team Members Processed Invoice"
                isSuperAdmin
                teamUrl="/financials/invoices-team-treated-invoice"
                organizationCurrency={organizationCurrency}
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
            const data = await FinancialService.listSubmittedInvoices(
                pagingOptions.offset,
                pagingOptions.limit,
                superAdminId,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
                1,
            );
            const organizationCurrency =
                await UserService.getControlSettingById(superAdminId);

            return {
                props: {
                    invoiceData: data,
                    organizationCurrency:
                        organizationCurrency.data?.organizationDefaultCurrency,
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
