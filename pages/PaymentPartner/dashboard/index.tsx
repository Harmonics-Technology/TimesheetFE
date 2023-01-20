import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import PaymentPartnerDashboard from '@components/subpages/PaymentPartnerDashboard';
// import SadminDashboard from "@components/subpages/SadminDashboard";
import { GetServerSideProps } from 'next';
import { DashboardService, FinancialService } from 'src/services';
interface DashboardProps {
    payroll: any;
    invoices: any;
}

function index({ payroll, invoices }: DashboardProps) {
    return <PaymentPartnerDashboard payroll={payroll} invoices={invoices} />;
}

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            // const data = await DashboardService.getPayrollManagerMetrics();
            const payroll = await FinancialService.listPaymentPartnerInvoices(
                pagingOptions.offset,
                pagingOptions.limit,
            );
            const invoices =
                await FinancialService.listInvoicesByPaymentPartner(
                    pagingOptions.offset,
                    pagingOptions.limit,
                );
            // console.log({ data });
            return {
                props: {
                    payroll,
                    invoices,
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
