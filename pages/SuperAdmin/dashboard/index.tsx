import { withPageAuth } from '@components/generics/withPageAuth';
import SuperAdminDashboard from '@components/subpages/SuperAdminDashboard';
import { GetServerSideProps } from 'next';
import { DashboardService, ProjectManagementService } from 'src/services';
interface DashboardProps {
    metrics: any;
    counts: any;
}

function index({ metrics, counts }: DashboardProps) {
    return <SuperAdminDashboard metrics={metrics} counts={counts} />;
}

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).id;
        // console.log({ superAdminId });
        try {
            const data = await DashboardService.getAdminMetrics(superAdminId);
            const counts =
                await ProjectManagementService.getStatusCountForProject(
                    superAdminId,
                );
            return {
                props: {
                    metrics: data,
                    counts: counts.data,
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
