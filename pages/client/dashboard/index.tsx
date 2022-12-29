import { withPageAuth } from '@components/generics/withPageAuth';
import SadminDashboard from '@components/subpages/SadminDashboard';
import TeamDashboard from '@components/subpages/TeamDashboard';
import { GetServerSideProps } from 'next';
import { DashboardService } from 'src/services';
interface DashboardProps {
    metrics: any;
}

function index({ metrics }: DashboardProps) {
    return <TeamDashboard metrics={metrics} role="client" />;
}

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(async () => {
    try {
        const data = await DashboardService.getClientMetrics();
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
});
