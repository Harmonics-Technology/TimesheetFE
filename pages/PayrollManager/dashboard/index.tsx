import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import PayrollManagerDashboard from '@components/subpages/PayrollManagerDashboard';
import SadminDashboard from '@components/subpages/SadminDashboard';
import { GetServerSideProps } from 'next';
import { DashboardService, FinancialService } from 'src/services';
interface DashboardProps {
    metrics: any;
}

function index({ metrics }: DashboardProps) {
    return <PayrollManagerDashboard metrics={metrics} />;
}

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;

        try {
            const data = await DashboardService.getAdminMetrics(superAdminId);

            return {
                props: {
                    metrics: data,
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
