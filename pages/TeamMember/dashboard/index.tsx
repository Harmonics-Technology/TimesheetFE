import { withPageAuth } from '@components/generics/withPageAuth';
import TeamDashboard from '@components/subpages/TeamDashboard';
import { GetServerSideProps } from 'next';
import {
    DashboardService,
    FinancialService,
    PaySlipViewPagedCollectionStandardResponse,
} from 'src/services';
interface DashboardProps {
    metrics: any;
    payslips: PaySlipViewPagedCollectionStandardResponse;
}

function index({ metrics, payslips }: DashboardProps) {
    return <TeamDashboard metrics={metrics} payslip={payslips} />;
}

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const id = JSON.parse(ctx.req.cookies.user).employeeInformationId;
        ({ id });
        try {
            const data = await DashboardService.getTeamMemberMetrics(id);
            const payslips = await FinancialService.listPaySlipsByTeamMember();
            // ({ payslips });
            return {
                props: {
                    metrics: data,
                    payslips,
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
