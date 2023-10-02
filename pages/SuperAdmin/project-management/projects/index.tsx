import { ProjectPage } from '@components/bits-utils/ProjectManagement/Projects';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ProjectManagementService,
    ProjectProgressCountView,
    UserService,
} from 'src/services';

const projectsIndex = ({
    iProjects,
    nProjects,
    cProjects,
    users,
    superAdminId,
    counts,
}: {
    iProjects: any;
    nProjects: any;
    cProjects: any;
    users: any;
    superAdminId: string;
    counts: ProjectProgressCountView;
}) => {
    return (
        <ProjectPage
            iProjects={iProjects}
            nProjects={nProjects}
            cProjects={cProjects}
            users={users}
            superAdminId={superAdminId}
            counts={counts}
        />
    );
};

export default projectsIndex;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).id;
        const pagingOptions = filterPagingSearchOptions(ctx);
        //
        const fetchProjectByStatus = (status) => {
            const data = ProjectManagementService.listProject(
                pagingOptions.offset,
                pagingOptions.limit,
                superAdminId,
                status,
                undefined,
                pagingOptions.search,
            );
            return data;
        };
        try {
            const nProgress = await fetchProjectByStatus(1);
            const iProgress = await fetchProjectByStatus(2);
            const cProgress = await fetchProjectByStatus(3);
            const users = await UserService.listUsers(
                'Team Member',
                superAdminId,
                pagingOptions.offset,
                80,
                pagingOptions.search,
            );
            const counts =
                await ProjectManagementService.getStatusCountForProject(
                    superAdminId,
                );
            //
            return {
                props: {
                    iProjects: iProgress.data,
                    nProjects: nProgress.data,
                    cProjects: cProgress.data,
                    users: users.data,
                    superAdminId,
                    counts: counts.data,
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
