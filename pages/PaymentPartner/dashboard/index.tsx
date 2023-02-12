import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import PaymentPartnerDashboard from '@components/subpages/PaymentPartnerDashboard';
// import SadminDashboard from "@components/subpages/SadminDashboard";
import { GetServerSideProps } from 'next';
import { DashboardService, FinancialService } from 'src/services';
interface DashboardProps {
    metrics: any;
    pendingPayrolls: any;
}

function index({ metrics, pendingPayrolls }: DashboardProps) {
    return (
        <PaymentPartnerDashboard
            metrics={metrics}
            pendingPayrolls={pendingPayrolls}
        />
    );
}

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const metrics = await DashboardService.getPayrollManagerMetrics();
            const pendingPayrolls =
                await FinancialService.listPendingInvoicedInvoicesForPaymentPartner(
                    pagingOptions.offset,
                    pagingOptions.limit,
                );

            return {
                props: {
                    metrics,
                    pendingPayrolls,
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
