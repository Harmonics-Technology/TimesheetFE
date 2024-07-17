import { SingleTask } from '@components/bits-utils/ProjectManagement/Projects/SingleProject/SingleTask';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { id } from 'date-fns/locale';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ProjectManagementService,
    UserService,
    UtilityService,
} from 'src/services';

const ProjectSingleTask = ({
    projectId,
    task,
    tasks,
    project,
    users,
    id,
    currencies,
}) => {
    return (
        <SingleTask
            id={id}
            project={project}
            tasks={tasks}
            task={task}
            users={users}
            currencies={currencies}
        />
    );
};

export default ProjectSingleTask;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        const pagingOptions = filterPagingSearchOptions(ctx);
        const { projectId } = ctx.query;
        const { id } = ctx.query;
        try {
            const data = await ProjectManagementService.getProject(id);
            const task = await ProjectManagementService.getTask(projectId);
            const tasks = await ProjectManagementService.listSubTasks(
                pagingOptions.offset,
                pagingOptions.limit,
                projectId,
                pagingOptions.status,
                pagingOptions.search,
            );
            const users = await UserService.listUsers(
                'Team Member',
                superAdminId,
                pagingOptions.offset,
                80,
                pagingOptions.search,
            );
            const currencies = await UtilityService.listCountries();

            return {
                props: {
                    project: data.data,
                    task: task.data,
                    projectId,
                    id,
                    tasks: tasks.data,
                    users: users.data,
                    currencies: currencies.data,
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
