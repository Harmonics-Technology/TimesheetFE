import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import SadminDashboard from '@components/subpages/SadminDashboard';
import { GetServerSideProps } from 'next';
import { DashboardService, UserService } from 'src/services';
interface DashboardProps {
    metrics: any;
    team: any;
}

function index({ metrics, team }: DashboardProps) {
    return <SadminDashboard metrics={metrics} team={team} />;
}

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const data = await DashboardService.getAdminMetrics();
            const team = await UserService.listUsers({
                role: 'Team Member',
                superAdminId: pagingOptions.offset,
                offset: pagingOptions.limit,
                limit: pagingOptions.search,
            });
            //
            return {
                props: {
                    metrics: data,
                    team,
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
