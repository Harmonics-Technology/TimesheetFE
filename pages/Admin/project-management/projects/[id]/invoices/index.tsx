import { ListInvoices } from '@components/bits-utils/ProjectManagement/Invoices/ListInvoices';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ProjectInvoiceRecipientView,
    ProjectInvoiceViewPagedCollection,
    ProjectManagementService,
} from 'src/services';

const invoices = ({
    id,
    invoices,
    recipients,
}: {
    id: string;
    invoices: ProjectInvoiceViewPagedCollection;
    recipients: ProjectInvoiceRecipientView[];
}) => {
    return <ListInvoices id={id} invoices={invoices} recipients={recipients} />;
};

export default invoices;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        const pagingOptions = filterPagingSearchOptions(ctx);
        const { id } = ctx.query;
        try {
            const invoices = await ProjectManagementService.listProjectInvoices(
                pagingOptions.offset,
                pagingOptions.limit,
                superAdminId,
                id,
                pagingOptions.status,
                pagingOptions.subId,
                pagingOptions.from,
                pagingOptions.to,
                pagingOptions.search,
            );

            const recipients =
                await ProjectManagementService.listEmailRecipient(superAdminId);
            return {
                props: {
                    invoices: invoices.data,
                    recipients: recipients.data,
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
