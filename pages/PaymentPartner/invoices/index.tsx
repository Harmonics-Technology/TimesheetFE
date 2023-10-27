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
    UserService,
} from 'src/services';

interface PayrollType {
    invoice: InvoiceViewPagedCollectionStandardResponse;
    clients: any;
    clientId: any;
    superAdminId: any;
}
function expenses({ invoice, clients, clientId, superAdminId }: PayrollType) {
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    return (
        <Box>
            <PaymentPartnerInvoice
                invoiceData={invoice}
                id={clientId}
                clients={clients}
                superAdminId={superAdminId}
            />
        </Box>
    );
}

export default expenses;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const clientId = pagingOptions?.clientId;
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await FinancialService.listInvoicesByPaymentPartner(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                clientId,
                pagingOptions.from,
                pagingOptions.to,
            );
            const clients = await UserService.listUsers(
                'client',
                superAdminId,
                pagingOptions.offset,
                40,
                pagingOptions.search,
            );

            return {
                props: {
                    invoice: data,
                    clientId: clientId || superAdminId,
                    clients: clients?.data?.value,
                    superAdminId,
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
