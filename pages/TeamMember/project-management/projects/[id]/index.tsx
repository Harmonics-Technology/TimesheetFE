import { SingleTask } from '@components/bits-utils/ProjectManagement/Projects/SingleProject/SingleTask';
import { TeamSingleTask } from '@components/bits-utils/ProjectManagement/Projects/SingleProject/TeamSingleTask';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { id } from 'date-fns/locale';
import { GetServerSideProps } from 'next';
import React from 'react';
import { ProjectManagementService } from 'src/services';

const ProjectSingleTask = ({ projectId, task, tasks, project }) => {
    return (
        <TeamSingleTask
            id={projectId}
            project={project}
            tasks={tasks}
            task={task}
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
            console.log({ tasks });

            return {
                props: {
                    project: data.data,
                    task: task.data,
                    projectId,
                    tasks: tasks.data,
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
