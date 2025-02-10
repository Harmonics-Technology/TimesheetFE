import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { ListCollaboratorInvoices } from '@components/subpages/Collaborator/ListCollaboratorInvoices';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ProjectInvoiceRecipientView,
    ProjectInvoiceViewPagedCollection,
    ProjectManagementService,
} from 'src/services';

const invoices = ({
    invoices,
}: {
    id: string;
    invoices: ProjectInvoiceViewPagedCollection;
    recipients: ProjectInvoiceRecipientView[];
}) => {
    return <ListCollaboratorInvoices invoices={invoices} />;
};

export default invoices;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const invoices = await ProjectManagementService.listProjectInvoices(
                pagingOptions.offset,
                pagingOptions.limit,
                superAdminId,
                undefined,
                pagingOptions.status,
                pagingOptions.subId,
                pagingOptions.from,
                pagingOptions.to,
                pagingOptions.search,
            );

            return {
                props: {
                    invoices: invoices.data,
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
