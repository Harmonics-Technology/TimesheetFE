import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { CreateCollaboratorInvoice } from '@components/subpages/Collaborator/CreateCollaboratorInvoice';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ListProjectViewPagedCollection,
    ProjectManagementService,
} from 'src/services';

const CreateInvoices = ({
    projects,
    superAdminId,
}: {
    projects: ListProjectViewPagedCollection;
    superAdminId: string;
}) => {
    return (
        <CreateCollaboratorInvoice
            projects={projects}
            superAdminId={superAdminId}
        />
    );
};

export default CreateInvoices;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        // const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const data = await ProjectManagementService.listStrippedProject(
                0,
                100,
                superAdminId,
            );

            return {
                props: {
                    projects: data.data,
                    superAdminId,
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
