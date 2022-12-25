import { withPageAuth } from '@components/generics/withPageAuth';
import TeamDashboard from '@components/subpages/TeamDashboard';
import { GetServerSideProps } from 'next';
import { DashboardService } from 'src/services';
interface DashboardProps {
    metrics: any;
}

function index({ metrics }: DashboardProps) {
    return <TeamDashboard metrics={metrics} />;
}

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const id = JSON.parse(ctx.req.cookies.user).employeeInformationId;
        console.log({ id });
        try {
            const data = await DashboardService.getTeamMemberMetrics(id);
            console.log({ data });
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
