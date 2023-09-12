import { ProjectPage } from '@components/bits-utils/ProjectManagement/Projects';
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
    counts : any;
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
        const superAdminId = JSON.parse(ctx.req.cookies.user).id;
        const pagingOptions = filterPagingSearchOptions(ctx);
        // console.log({ superAdminId });
        try {
            const data = await ProjectManagementService.listProject(
                pagingOptions.offset,
                pagingOptions.limit,
                superAdminId,
                pagingOptions.status || 1,
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
                await ProjectManagementService.getStatusCountForProject(
                    superAdminId,
                );
            // console.log({data})
            return {
                props: {
                    projects: data.data,
                    users: users.data,
                    superAdminId,
                    counts: counts.data,
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
