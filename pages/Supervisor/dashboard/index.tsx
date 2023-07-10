import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import SupervisorDashboard from '@components/subpages/SupervisorDashboard';
import { GetServerSideProps } from 'next';
import { DashboardService, FinancialService } from 'src/services';
interface DashboardProps {
    metrics: any;
    expense: any;
}

function index({ metrics, expense }: DashboardProps) {
    return <SupervisorDashboard adminMetrics={metrics} expenses={expense} />;
}

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await DashboardService.getSupervisorMetrics();
            const expense = await FinancialService.listSuperviseesExpenses(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
            );
            console.log({ data });
            return {
                props: {
                    metrics: data.data,
                    expense: expense.data?.value,
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
