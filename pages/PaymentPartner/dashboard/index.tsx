import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import PaymentPartnerDashboard from '@components/subpages/PaymentPartnerDashboard';
import axios from 'axios';
// import SadminDashboard from "@components/subpages/SadminDashboard";
import { GetServerSideProps } from 'next';
import { DashboardService, FinancialService } from 'src/services';
interface DashboardProps {
    metrics: any;
    pendingPayrolls: any;
    result;
}

function index({ metrics, pendingPayrolls, result }: DashboardProps) {
    return (
        <PaymentPartnerDashboard
            metrics={metrics}
            pendingPayrolls={pendingPayrolls}
            result={result}
        />
    );
}

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const url = 'https://www.lemonade.finance/api/lemonade/getExchange';
        const payload = {
            from: 'CAD',
            to: 'NGN',
        };
        const headers = {
            'Content-Type': 'application/json',
            Origin: 'https://www.lemonade.finance',
            Referer:
                'https://www.lemonade.finance/international-money-transfer',
            'Access-Control-Allow-Origin': '*',
        };
        try {
            const metrics = await DashboardService.getPayrollManagerMetrics();
            const pendingPayrolls =
                await FinancialService.listPendingInvoicedInvoicesForPaymentPartner(
                    pagingOptions.offset,
                    pagingOptions.limit,
                );

            // const result = await axios.post(url, payload, { headers: headers });
            // console.log({ result });

            return {
                props: {
                    metrics,
                    pendingPayrolls,
                    // result: result.data,
                },
            };
        } catch (error: any) {
            console.log({ error });
            return {
                props: {
                    data: [],
                },
            };
        }
    },
);
