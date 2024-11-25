import { CreateInvoice } from '@components/bits-utils/ProjectManagement/Invoices/CreateInvoice';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ProjectInvoiceView,
    ProjectManagementService,
    ProjectTaskViewPagedCollection,
    ProjectView,
    UserService,
    UserView,
} from 'src/services';

const SingleId = ({
    id,
    project,
    tasks,
    users,
    invoice,
}: {
    id: string;
    project: ProjectView;
    tasks: ProjectTaskViewPagedCollection;
    invoice: ProjectInvoiceView;
    users: UserView[];
}) => {
    return (
        <CreateInvoice
            id={id}
            project={project}
            tasks={tasks}
            users={users}
            invoice={invoice}
        />
    );
};

export default SingleId;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        const pagingOptions = filterPagingSearchOptions(ctx);
        const { id, singleId } = ctx.query;
        try {
            const invoice = await ProjectManagementService.getInvoiceById(
                singleId,
            );
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
                    invoice: invoice.data,
                    project: data.data,
                    tasks: tasks.data,
                    users: users.data,
                    id,
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
