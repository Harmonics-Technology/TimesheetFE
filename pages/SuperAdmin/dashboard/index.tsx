import { withPageAuth } from "@components/generics/withPageAuth";
import SadminDashboard from "@components/subpages/SadminDashboard";
import { GetServerSideProps } from "next";
import { DashboardService } from "src/services";
interface DashboardProps {
    metrics: any;
}

function index({ metrics }: DashboardProps) {
    return <SadminDashboard metrics={metrics} />;
}

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(async () => {
    try {
        const data = await DashboardService.getAdminMetrics();
        // console.log({ data });
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
