import { Box, Flex } from '@chakra-ui/react';
import PageTabs from '@components/bits-utils/PageTabs';
import { UserContext } from '@components/context/UserContext';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import PayrollTreatPartnerInvoice from '@components/subpages/PayrollTreatPartnerInvoice';
import { GetServerSideProps } from 'next';
import React, { useContext } from 'react';
import {
    FinancialService,
    InvoiceViewPagedCollectionStandardResponse,
    UserService,
} from 'src/services';

interface invoiceType {
    invoiceData: InvoiceViewPagedCollectionStandardResponse;
    paygroupId: any;
    clients: any;
}
function Invoices({ invoiceData, paygroupId, clients }: invoiceType) {
    return (
        <Box>
            <PayrollTreatPartnerInvoice
                invoiceData={invoiceData}
                record={5}
                paygroupId={paygroupId}
                fileName="Proinsight invoices from payment partner"
                clients={clients}
            />
        </Box>
    );
}

export default Invoices;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        const paygroupId = pagingOptions.clientId || superAdminId;
        try {
            const data =
                await FinancialService.listPaymentPartnerInvoicesForPayrollManagers(
                    pagingOptions.offset,
                    pagingOptions.limit,
                    pagingOptions.search,
                    pagingOptions.clientId || superAdminId,
                    pagingOptions.from,
                    pagingOptions.to,
                );
            const clients = await UserService.listUsers(
                'client',
                superAdminId,
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
            );

            return {
                props: {
                    invoiceData: data,
                    paygroupId,
                    clients: clients.data,
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
