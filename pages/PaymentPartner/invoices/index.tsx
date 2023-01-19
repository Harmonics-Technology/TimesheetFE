import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import AdminInvoices from '@components/subpages/AdminInvoices';
import PayPartnerInvoice from '@components/subpages/PayPartnerDashboard';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    FinancialService,
    InvoiceViewPagedCollectionStandardResponse,
} from 'src/services';
interface invoiceProps {
    invoice: InvoiceViewPagedCollectionStandardResponse;
}

function invoices({ invoice }: invoiceProps) {
    return <PayPartnerInvoice invoiceData={invoice} />;
}

export default invoices;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const data =
                await FinancialService.listInvoicesByPaymentPartner(
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
