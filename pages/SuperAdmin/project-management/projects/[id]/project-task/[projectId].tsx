import { SingleTask } from '@components/bits-utils/ProjectManagement/Projects/SingleProject/SingleTask';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { id } from 'date-fns/locale';
import { GetServerSideProps } from 'next';
import React from 'react';
import { ProjectManagementService, UserService } from 'src/services';

const ProjectSingleTask = ({ projectId, task, tasks, project, users }) => {
    return (
        <SingleTask
            id={projectId}
            project={project}
            tasks={tasks}
            task={task}
            users={users}
        />
    );
};

export default ProjectSingleTask;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).id;
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

            return {
                props: {
                    project: data.data,
                    task: task.data,
                    projectId,
                    tasks: tasks.data,
                    users: users.data,
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
