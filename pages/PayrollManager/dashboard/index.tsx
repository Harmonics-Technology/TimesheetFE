import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import PayrollManagerDashboard from '@components/subpages/PayrollManagerDashboard';
import SadminDashboard from '@components/subpages/SadminDashboard';
import { GetServerSideProps } from 'next';
import { DashboardService, FinancialService } from 'src/services';
interface DashboardProps {
    metrics: any;
    payslips: any;
    invoices: any;
}

function index({ metrics, payslips, invoices }: DashboardProps) {
    return (
        <PayrollManagerDashboard
            metrics={metrics}
            payslips={payslips}
            invoices={invoices}
        />
    );
}

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const pagingOptions = filterPagingSearchOptions(ctx);

        try {
            const data = await DashboardService.getAdminMetrics();
            const payslips = await FinancialService.listPaySlips(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
            );
            const invoices = await FinancialService.listInvoicedInvoices(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                pagingOptions.date,
            );
            console.log({ payslips, invoices });
            return {
                props: {
                    metrics: data,
                    payslips,
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
