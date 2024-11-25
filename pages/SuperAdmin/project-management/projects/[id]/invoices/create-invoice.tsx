import { CreateInvoice } from '@components/bits-utils/ProjectManagement/Invoices/CreateInvoice';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ProjectManagementService,
    ProjectTaskViewPagedCollection,
    ProjectView,
    UserService,
    UserView,
} from 'src/services';

const CreateInvoices = ({
    id,
    project,
    tasks,
    users,
}: {
    id: string;
    project: ProjectView;
    tasks: ProjectTaskViewPagedCollection;
    users: UserView[];
}) => {
    return (
        <CreateInvoice id={id} project={project} tasks={tasks} users={users} />
    );
};

export default CreateInvoices;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        const pagingOptions = filterPagingSearchOptions(ctx);
        const { id } = ctx.query;
        try {
            const data = await ProjectManagementService.getProject(id);
            const tasks = await ProjectManagementService.listTasks(
                pagingOptions.offset,
                50,
                superAdminId,
                id,
            );
            const users = await UserService.listUsersByRoles(
                superAdminId,
                'client',
            );
            return {
                props: {
                    project: data.data,
                    tasks: tasks.data,
                    users: users.data,
                    id,
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
