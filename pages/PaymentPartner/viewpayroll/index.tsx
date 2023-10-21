import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import PaymentPartnerPayroll from '@components/subpages/PaymentPartnerPayroll';
import { GetServerSideProps } from 'next';
import React from 'react';
import { FinancialService, UserService } from 'src/services';

function index({ payrolls, clients, clientId, superAdminId }) {
    return (
        <PaymentPartnerPayroll
            payrolls={payrolls}
            id={clientId}
            clients={clients}
            superAdminId={superAdminId}
        />
    );
}

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        const clientId = pagingOptions?.clientId;
        try {
            const data = await FinancialService.listPayrollGroupInvoices(
                superAdminId,
                pagingOptions.offset,
                pagingOptions.limit,
                clientId,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
            );
            const clients = await UserService.listUsers(
                'client',
                superAdminId,
                pagingOptions.offset,
                40,
                pagingOptions.search,
            );

            return {
                props: {
                    payrolls: data,
                    clientId: clientId || superAdminId,
                    clients: clients?.data?.value,
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
