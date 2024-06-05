import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { OperationDashboard } from '@components/subpages/OperationalTask/OperationDashboard';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ProjectManagementService,
    ProjectProgressCountView,
    UserService,
} from 'src/services';

const OperationTask = ({
    iProjects,
    nProjects,
    cProjects,
    projects,
    counts,
    users,
    superAdminId,
    userId,
}: {
    iProjects: any;
    nProjects: any;
    cProjects: any;
    projects: any;
    counts: ProjectProgressCountView;
    users: any;
    superAdminId: string;
    userId;
}) => {
    return (
        <OperationDashboard
            iProjects={iProjects}
            nProjects={nProjects}
            cProjects={cProjects}
            projects={projects}
            counts={counts}
            users={users}
            superAdminId={superAdminId}
            id={userId}
        />
    );
};

export default OperationTask;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        const userId = JSON.parse(ctx.req.cookies.user).id;
        const pagingOptions = filterPagingSearchOptions(ctx);
        // const fetchProjectByStatus = (status) => {
        //     const data = ProjectManagementService.listOperationalTasks(
        //         pagingOptions.offset,
        //         pagingOptions.limit,
        //         superAdminId,
        //         status,
        //         undefined,
        //         pagingOptions.search,
        //     );
        //     return data;
        // };
        //
        try {
            // const nProgress = await fetchProjectByStatus(1);
            // const iProgress = await fetchProjectByStatus(2);
            // const cProgress = await fetchProjectByStatus(3);
            const data = await ProjectManagementService.listOperationalTasks(
                pagingOptions.offset,
                pagingOptions.limit,
                superAdminId,
                pagingOptions.status,
                userId,
                pagingOptions.search,
            );
            const users = await UserService.listUsers(
                'Team Member',
                superAdminId,
                pagingOptions.offset,
                pagingOptions.limit || 50,
                pagingOptions.search,
            );
            const counts =
                await ProjectManagementService.getStatusCountForOperationalTask(
                    superAdminId,
                );

            return {
                props: {
                    // iProjects: iProgress.data,
                    // nProjects: nProgress.data,
                    // cProjects: cProgress.data,
                    projects: data.data,
                    users: users.data,
                    superAdminId,
                    counts: counts.data,
                    userId,
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
