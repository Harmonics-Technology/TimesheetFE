import { SingleTask } from '@components/bits-utils/ProjectManagement/Projects/SingleProject/SingleTask';
import { TeamSingleTask } from '@components/bits-utils/ProjectManagement/Projects/SingleProject/TeamSingleTask';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { id } from 'date-fns/locale';
import { GetServerSideProps } from 'next';
import React from 'react';
import { ProjectManagementService } from 'src/services';

const ProjectSingleTask = ({ id, project, tasks, task }) => {
    return (
        <TeamSingleTask id={id} project={project} tasks={tasks} task={task} />
    );
};

export default ProjectSingleTask;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        const userId = JSON.parse(ctx.req.cookies.user).id;
        const pagingOptions = filterPagingSearchOptions(ctx);
        const { projectId } = ctx.query;
        const { id } = ctx.query;
        try {
            const data = await ProjectManagementService.getProject(id);
            // const tasks = await ProjectManagementService.listTasks(
            //     pagingOptions.offset,
            //     pagingOptions.limit,
            //     superAdminId,
            //     projectId,
            //     pagingOptions.status,
            //     userId,
            //     pagingOptions.search,
            // );
            const task = await ProjectManagementService.getTask(projectId);
            const tasks = await ProjectManagementService.listSubTasks(
                pagingOptions.offset,
                pagingOptions.limit,
                projectId,
                pagingOptions.status,
                pagingOptions.search,
            );

            return {
                props: {
                    project: data.data,
                    id,
                    tasks: tasks.data,
                    task: task.data,
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
