import { SingleProjectPage } from '@components/bits-utils/ProjectManagement/Projects/SingleProject';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import { DashboardService, ProjectManagementService } from 'src/services';

const projectDashboard = ({ id, projects, metrics }) => {
    return <SingleProjectPage id={id} projects={projects} metrics={metrics} />;
};

export default projectDashboard;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).id;
        const pagingOptions = filterPagingSearchOptions(ctx);
        const { id } = ctx.query;
        try {
            const data = await ProjectManagementService.getProject(id);
            const metrics = await DashboardService.getProjectDashboard(id);
            return {
                props: {
                    projects: data.data,
                    superAdminId,
                    metrics: metrics.data,
                    id,
                },
            };
        } catch (error: any) {
            console.log({ error });
            return {
                props: {
                    data: [],
                },
            };
        }
    },
);
