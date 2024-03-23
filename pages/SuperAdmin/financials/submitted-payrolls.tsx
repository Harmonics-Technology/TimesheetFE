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
    invoiceData: InvoiceViewPagedCollectionStandardResponse;
    organizationCurrency: any;
    converted?: any;
}
function payrolls({
    invoiceData,
    organizationCurrency,
    converted,
}: InvoiceType) {
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    return (
        <Box>
            <AdminInvoices
                invoiceData={invoiceData}
                record={2}
                fileName="Approved Payrolls"
                isSuperAdmin
                organizationCurrency={organizationCurrency}
                converted={converted}
            />
        </Box>
    );
}

export default payrolls;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        const converted = pagingOptions.convert === 'true';
        try {
            const data = await FinancialService.listSubmittedInvoices(
                pagingOptions.offset,
                pagingOptions.limit,
                superAdminId,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
                2,
                converted,
            );
            const organizationCurrency =
                await UserService.getControlSettingById(superAdminId);

            return {
                props: {
                    invoiceData: data,
                    organizationCurrency:
                        organizationCurrency.data?.organizationDefaultCurrency,
                    converted,
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
