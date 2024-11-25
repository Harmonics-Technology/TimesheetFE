import { ProjectInvoice } from '@components/bits-utils/ProjectManagement/Invoices/ProjectInvoice';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import { ProjectInvoiceView, ProjectManagementService } from 'src/services';

const Invoice = ({
    id,
    invoice,
}: {
    id: string;
    invoice: ProjectInvoiceView;
}) => {
    return <ProjectInvoice id={id} invoice={invoice} />;
};

export default Invoice;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        const { id, invoiceId } = ctx.query;
        try {
            const data = await ProjectManagementService.getInvoiceById(
                invoiceId,
            );
            console.log({ data });

            return {
                props: {
                    invoice: data.data,
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
