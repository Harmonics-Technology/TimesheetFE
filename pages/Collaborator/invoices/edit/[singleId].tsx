import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { CreateCollaboratorInvoice } from '@components/subpages/Collaborator/CreateCollaboratorInvoice';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ListProjectViewPagedCollection,
    ProjectInvoiceView,
    ProjectManagementService,
} from 'src/services';

const SingleId = ({
    projects,
    invoice,
    superAdminId,
}: {
    projects: ListProjectViewPagedCollection;
    invoice: ProjectInvoiceView;
    superAdminId: string;
}) => {
    return (
        <CreateCollaboratorInvoice
            projects={projects}
            invoice={invoice}
            superAdminId={superAdminId}
        />
    );
};

export default SingleId;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        // const pagingOptions = filterPagingSearchOptions(ctx);
        const { singleId } = ctx.query;
        try {
            const invoice = await ProjectManagementService.getInvoiceById(
                singleId,
            );
            const data = await ProjectManagementService.listStrippedProject(
                0,
                100,
                superAdminId,
            );

            return {
                props: {
                    invoice: invoice.data,
                    projects: data.data,
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
