import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { ListCollabInvoicesForAdmin } from '@components/subpages/Collaborator/ListCollabInvoicesForAdmin';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ProjectInvoiceViewPagedCollection,
    ProjectManagementService,
} from 'src/services';

const invoices = ({
    invoices,
}: {
    invoices: ProjectInvoiceViewPagedCollection;
}) => {
    return (
        <ListCollabInvoicesForAdmin
            invoices={invoices}
            teamUrl="/financials/invoices-team"
        />
    );
};

export default invoices;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const invoices =
                await ProjectManagementService.listCollaboratorProjectInvoices(
                    pagingOptions.offset,
                    pagingOptions.limit,
                    superAdminId,
                    undefined,
                    undefined,
                    pagingOptions.status,
                    pagingOptions.subId,
                    pagingOptions.from,
                    pagingOptions.to,
                    pagingOptions.search,
                );

            console.log({ invoices });
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
