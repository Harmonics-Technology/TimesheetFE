import { SingleTask } from '@components/bits-utils/ProjectManagement/Projects/SingleProject/SingleTask';
import { TeamSingleTask } from '@components/bits-utils/ProjectManagement/Projects/SingleProject/TeamSingleTask';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { id } from 'date-fns/locale';
import { GetServerSideProps } from 'next';
import React from 'react';
import { ProjectManagementService, UserService } from 'src/services';

const ProjectSingleTask = ({ id, project, tasks, task, access, pm }) => {
    return (
        <TeamSingleTask
            id={id}
            project={project}
            tasks={tasks}
            task={task}
            access={access}
            pm={pm}
        />
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
            const access =
                await UserService.getSuperAdminProjectManagementSettings(
                    superAdminId,
                );
            const pm = await UserService.listUsers(
                //@ts-ignore
                undefined,
                superAdminId,
                pagingOptions.offset,
                50,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
                undefined,
                true,
            );

            return {
                props: {
                    project: data.data,
                    id,
                    tasks: tasks.data,
                    task: task.data,
                    access: access.data,
                    pm: pm.data,
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
