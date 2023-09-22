import { Box, Flex } from '@chakra-ui/react';
import PageTabs from '@components/bits-utils/PageTabs';
import { UserContext } from '@components/context/UserContext';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import TeamInvoices from '@components/subpages/TeamInvoices';
import { GetServerSideProps } from 'next';
import React, { useContext } from 'react';
import {
    FinancialService,
    InvoiceViewPagedCollectionStandardResponse,
} from 'src/services';

interface PayrollType {
    invoice: InvoiceViewPagedCollectionStandardResponse;
}
function payslips({ invoice }: PayrollType) {
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    return (
        <Box>
            <Flex>
                <PageTabs
                    url={`/${role}/financials/my-invoices`}
                    tabName="Awaiting Submission"
                />
                <PageTabs
                    url={`/${role}/financials/invoices`}
                    tabName="Submitted"
                />
            </Flex>
            <TeamInvoices invoiceList={invoice} />
        </Box>
    );
}

export default payslips;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const id = JSON.parse(ctx.req.cookies.user).employeeInformationId;
        try {
            const data = await FinancialService.listTeamMemberInvoices(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
                1,
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
