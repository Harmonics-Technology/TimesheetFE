import { TeamProjectTask } from '@components/bits-utils/ProjectManagement/Projects/SingleProject/TeamProjectTask';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import { ProjectManagementService, UserService } from 'src/services';

const index = ({ id, project, tasks, users, access }) => {
    return (
        <TeamProjectTask
            id={id}
            project={project}
            tasks={tasks}
            users={users}
            access={access}
        />
    );
};

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        const pagingOptions = filterPagingSearchOptions(ctx);
        const userId = JSON.parse(ctx.req.cookies.user).id;
        const { id } = ctx.query;
        try {
            const data = await ProjectManagementService.getProject(id);
            const tasks = await ProjectManagementService.listTasks(
                pagingOptions.offset,
                pagingOptions.limit,
                superAdminId,
                id,
                pagingOptions.status,
                userId,
                pagingOptions.search,
            );
            const users = await UserService.listUsers(
                'Team Member',
                superAdminId,
                pagingOptions.offset,
                80,
                pagingOptions.search,
            );
            const access =
                await UserService.getSuperAdminProjectManagementSettings(
                    superAdminId,
                );

            return {
                props: {
                    project: data.data,
                    id,
                    tasks: tasks.data,
                    users: users.data,
                    access: access.data,
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
