import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import SuperAdminDashboard from '@components/subpages/SuperAdminDashboard';
import { GetServerSideProps } from 'next';
import { DashboardService, ProjectManagementService } from 'src/services';
interface DashboardProps {
    metrics: any;
    counts: any;
    summary: any;
    // error: any;
}

function index({ metrics, counts, summary }: DashboardProps) {
    return (
        <SuperAdminDashboard
            metrics={metrics}
            counts={counts}
            summary={summary}
            // error={error}
        />
    );
}

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).id;
        const pagingOptions = filterPagingSearchOptions(ctx);
        //
        try {
            const data = await DashboardService.getAdminMetrics(superAdminId);
            const counts =
                await ProjectManagementService.getStatusCountForProject(
                    superAdminId,
                );
            const summary = await ProjectManagementService.getSummaryReport(
                superAdminId,
                pagingOptions.from,
                pagingOptions.to,
            );
            return {
                props: {
                    metrics: data,
                    counts: counts.data,
                    summary: summary.data,
                },
            };
        } catch (error: any) {
            return {
                props: {
                    data: [],
                    // error: {
                    //     body: error?.body,
                    //     request: error?.request,
                    //     status: error?.status,
                    // },
                },
            };
        }
    },
);
