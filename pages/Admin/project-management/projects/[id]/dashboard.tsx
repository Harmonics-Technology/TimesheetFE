import { SingleProjectPage } from '@components/bits-utils/ProjectManagement/Projects/SingleProject';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    DashboardService,
    ProjectManagementService,
    UserService,
} from 'src/services';

const projectDashboard = ({ id, projects, metrics, users }) => {
    return <SingleProjectPage id={id} projects={projects} metrics={metrics} users={users} />;
};

export default projectDashboard;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        const pagingOptions = filterPagingSearchOptions(ctx);
        const { id } = ctx.query;
        try {
            const data = await ProjectManagementService.getProject(id);
            const metrics = await DashboardService.getProjectDashboard(id);
            const users = await UserService.listUsers(
                'Team Member',
                superAdminId,
                pagingOptions.offset,
                80,
                pagingOptions.search,
            );
            return {
                props: {
                    projects: data.data,
                    superAdminId,
                    metrics: metrics.data,
                    id,
                    users: users.data,
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
