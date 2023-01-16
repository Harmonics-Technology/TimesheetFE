import { Box, Flex } from '@chakra-ui/react';
import PageTabs from '@components/bits-utils/PageTabs';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import TeamInvoices from '@components/subpages/TeamInvoices';
import TeamInvoicesSubmitted from '@components/subpages/TeamInvoicesSubmitted';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    FinancialService,
    InvoiceViewPagedCollectionStandardResponse,
} from 'src/services';

interface PayrollType {
    invoice: InvoiceViewPagedCollectionStandardResponse;
}
function payslips({ invoice }: PayrollType) {
    return (
        <Box>
            <Flex>
                <PageTabs
                    url="/TeamMember/financials/my-invoices"
                    tabName="Awaiting Submission"
                />
                <PageTabs
                    url="/TeamMember/financials/submitted-invoices"
                    tabName="Submitted"
                />
            </Flex>
            <TeamInvoicesSubmitted invoiceList={invoice} />
        </Box>
    );
}

export default payslips;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const id = JSON.parse(ctx.req.cookies.user).employeeInformationId;
        try {
            const data = await FinancialService.listTeamMemberSubmittedInvoices(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                pagingOptions.date,
            );

            return {
                props: {
                    invoice: data,
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
