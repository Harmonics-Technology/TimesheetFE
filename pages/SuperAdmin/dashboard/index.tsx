import { withPageAuth } from '@components/generics/withPageAuth';
import SuperAdminDashboard from '@components/subpages/SuperAdminDashboard';
import { GetServerSideProps } from 'next';
import { DashboardService } from 'src/services';
interface DashboardProps {
    metrics: any;
}

function index({ metrics }: DashboardProps) {
    return <SuperAdminDashboard metrics={metrics} />;
}

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(async () => {
    try {
        const data = await DashboardService.getAdminMetrics();
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
