import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import ClientDashboard from '@components/subpages/ClientDashboard';
import { GetServerSideProps } from 'next';
import { DashboardService, FinancialService, UserService } from 'src/services';
interface DashboardProps {
    metrics: any;
    supervisor: any;
    team: any;
    invoice: any;
}

function index({ metrics, supervisor, team, invoice }: DashboardProps) {
    return (
        <ClientDashboard
            metrics={metrics}
            supervisor={supervisor}
            team={team}
            invoice={invoice}
        />
    );
}

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const id = JSON.parse(ctx.req.cookies.user).id;
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const team = await UserService.getClientTeamMembers(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                id,
            );
            const supervisor = await UserService.getClientSupervisors(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                id,
            );
            const invoice = await FinancialService.listClientInvoices(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
            );
            const data = await DashboardService.getClientMetrics();

            return {
                props: {
                    metrics: data,
                    supervisor,
                    team,
                    invoice,
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
