import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import ClientManagement from '@components/subpages/ClientManagement';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    UserService,
    UserViewPagedCollectionStandardResponse,
} from 'src/services';
interface clientProps {
    adminList: UserViewPagedCollectionStandardResponse;
}

function client({ adminList }: clientProps) {
    //
    return <ClientManagement adminList={adminList} />;
}

export default client;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await UserService.listUsers(
                'client',
                superAdminId,
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
            );
            return {
                props: {
                    adminList: data,
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
