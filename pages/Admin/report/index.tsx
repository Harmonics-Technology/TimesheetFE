import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { Reports } from '@components/subpages/Reports';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    DashboardService,
    FinancialService,
    ProjectManagementService,
    UserService,
} from 'src/services';

const index = ({ metrics, team, paymentPartner, chart, summary }) => {
    return (
        <Reports
            metrics={metrics}
            team={team}
            paymentPartner={paymentPartner}
            chart={chart}
            summary={summary}
        />
    );
};

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await DashboardService.getAdminMetrics(superAdminId);
            const team = await UserService.listUsers({
                role: 'Team Member',
                superAdminId,
                offset: pagingOptions.offset,
                limit: pagingOptions.limit,
                role: pagingOptions.search,
                search: pagingOptions.from,
                startDate: pagingOptions.to,
            });
            const paymentPartner =
                await FinancialService.listPaymentPartnerInvoicesForPayrollManagers(
                    pagingOptions.offset,
                    pagingOptions.limit,
                    pagingOptions.search,
                    pagingOptions.paySlipFilter || superAdminId,
                    pagingOptions.from,
                    pagingOptions.to,
                );
            const chart = await UserService.getUserCountByPayrolltypePerYear(
                pagingOptions.chartYear,
            );
            const summary = await ProjectManagementService.getSummaryReport(
                superAdminId,
                pagingOptions.from,
                pagingOptions.to,
            );
            return {
                props: {
                    metrics: data,
                    team,
                    paymentPartner,
                    chart,
                    summary: summary.data,
                },
            };
        } catch (error: any) {
            return {
                props: {
                    data: [],
                    team: [],
                },
            };
        }
    },
);
