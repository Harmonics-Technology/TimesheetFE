import { ProjectPage } from '@components/bits-utils/ProjectManagement/Projects/TeamMember/ProjectPage';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import { ProjectManagementService, UserService } from 'src/services';

const projectsIndex = ({
    projects,
    users,
    superAdminId,
    counts,
}: {
    projects: any;
    users: any;
    superAdminId: string;
    counts;
}) => {
    return (
        <ProjectPage
            projects={projects}
            users={users}
            superAdminId={superAdminId}
            counts={counts}
        />
    );
};

export default projectsIndex;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        const userId = JSON.parse(ctx.req.cookies.user).id;
        const pagingOptions = filterPagingSearchOptions(ctx);
        //
        try {
            const data = await ProjectManagementService.listProject(
                pagingOptions.offset,
                pagingOptions.limit,
                superAdminId,
                pagingOptions.status,
                userId,
                pagingOptions.search,
            );

            const counts =
                await ProjectManagementService.getStatusCountForProject(
                    superAdminId,
                    userId,
                );

            return {
                props: {
                    projects: data.data,
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
