import { SingleTask } from '@components/bits-utils/ProjectManagement/Projects/SingleProject/SingleTask';
import { TeamSingleTask } from '@components/bits-utils/ProjectManagement/Projects/SingleProject/TeamSingleTask';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { id } from 'date-fns/locale';
import { GetServerSideProps } from 'next';
import React from 'react';
import { ProjectManagementService } from 'src/services';

const ProjectSingleTask = ({ id, project, tasks }) => {
    return <TeamSingleTask id={id} project={project} tasks={tasks} />;
};

export default ProjectSingleTask;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        const userId = JSON.parse(ctx.req.cookies.user).id;
        const pagingOptions = filterPagingSearchOptions(ctx);
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

            return {
                props: {
                    project: data.data,
                    id,
                    tasks: tasks.data,
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
