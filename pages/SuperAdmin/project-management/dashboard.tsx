import React from 'react';
import { Dashboard } from '@components/bits-utils/ProjectManagement/Dashboard';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import {
    DashboardProjectManagementView,
    DashboardService,
    ProjectManagementService,
} from 'src/services';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';

const dashboard = ({
    metrics,
}: {
    metrics: DashboardProjectManagementView;
}) => {
    return <Dashboard metrics={metrics} />;
};

export default dashboard;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).id;
        const pagingOptions = filterPagingSearchOptions(ctx);

        try {
            const data = await DashboardService.getProjectManagementDashboard(
                superAdminId,
            );
            return {
                props: {
                    metrics: data.data,
                },
            };
        } catch (error: any) {
            return {
                props: {
                    metrics: [],
                },
            };
        }
    },
);
