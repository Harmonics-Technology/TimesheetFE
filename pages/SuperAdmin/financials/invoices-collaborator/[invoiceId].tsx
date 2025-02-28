import { withPageAuth } from '@components/generics/withPageAuth';
import { ViewCollaboratorInvoice } from '@components/subpages/Collaborator/ViewCollaboratorInvoice';
import { GetServerSideProps } from 'next';
import React from 'react';
import { ProjectInvoiceView, ProjectManagementService } from 'src/services';

const Invoice = ({ invoice }: { invoice: ProjectInvoiceView }) => {
    return <ViewCollaboratorInvoice invoice={invoice} />;
};

export default Invoice;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        // const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        const { invoiceId } = ctx.query;
        try {
            const data = await ProjectManagementService.getInvoiceById(
                invoiceId,
            );

            return {
                props: {
                    invoice: data.data,
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
