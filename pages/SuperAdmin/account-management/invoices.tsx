import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { LicenseInvoices } from '@components/subpages/ManageSub/LicenseInvoice';
import { GetServerSideProps } from 'next';
import React from 'react';
import { UserService } from 'src/services';

const invoices = ({ data }: { data }) => {
    return <LicenseInvoices data={data} />;
};

export default invoices;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        const pagingOption = filterPagingSearchOptions(ctx);
        try {
            const data = await UserService.getClientInvoices(
                superAdminId,
                pagingOption.offset,
                pagingOption.limit,
                pagingOption.search,
            );

            return {
                props: {
                    data: data.data?.data,
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
