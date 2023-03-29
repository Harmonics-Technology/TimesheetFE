import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { Reports } from '@components/subpages/Reports';
import { GetServerSideProps } from 'next';
import React from 'react';
import { DashboardService, FinancialService, UserService } from 'src/services';

const index = ({ metrics, team, paymentPartner, chart }) => {
    return (
        <Reports
            metrics={metrics}
            team={team}
            paymentPartner={paymentPartner}
            chart={chart}
        />
    );
};

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const data = await DashboardService.getAdminMetrics();
            const team = await UserService.listUsers(
                'Team Member',
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
            );
            const paymentPartner =
                await FinancialService.listPaymentPartnerInvoicesForPayrollManagers(
                    pagingOptions.offset,
                    pagingOptions.limit,
                    pagingOptions.search,
                    pagingOptions.paySlipFilter || 1,
                    pagingOptions.from,
                    pagingOptions.to,
                );
            const chart = await UserService.getUserCountByPayrolltypePerYear(
                pagingOptions.chartYear,
            );
            return {
                props: {
                    metrics: data,
                    team,
                    paymentPartner,
                    chart,
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
