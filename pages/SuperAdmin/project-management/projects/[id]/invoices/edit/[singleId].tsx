import { CreateInvoice } from '@components/bits-utils/ProjectManagement/Invoices/CreateInvoice';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ProjectInvoiceRecipientView,
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
    superAdminId,
}: {
    id: string;
    project: ProjectView;
    tasks: ProjectTaskViewPagedCollection;
    invoice: ProjectInvoiceView;
    users: ProjectInvoiceRecipientView[];
    superAdminId: string;
}) => {
    return (
        <CreateInvoice
            id={id}
            project={project}
            tasks={tasks}
            users={users}
            invoice={invoice}
            superAdminId={superAdminId}
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
            const recipients =
                await ProjectManagementService.listEmailRecipient(superAdminId);

            return {
                props: {
                    invoice: invoice.data,
                    project: data.data,
                    tasks: tasks.data,
                    users: recipients.data,
                    id,
                    superAdminId,
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
