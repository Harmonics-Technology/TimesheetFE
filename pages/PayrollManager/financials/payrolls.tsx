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
    UserService,
} from 'src/services';

interface InvoiceType {
    organizationCurrency: any;
    invoiceData: InvoiceViewPagedCollectionStandardResponse;
}
function expenses({ invoiceData, organizationCurrency }: InvoiceType) {
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    return (
        <Box>
            <AdminInvoices
                invoiceData={invoiceData}
                record={1}
                fileName="Pending Payrolls"
                organizationCurrency={organizationCurrency}
            />
        </Box>
    );
}

export default expenses;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await FinancialService.listSubmittedOffshoreInvoices(
                pagingOptions.offset,
                pagingOptions.limit,
                superAdminId,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
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
