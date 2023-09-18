import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import SupervisorManagement from '@components/subpages/SupervisorManagement';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    UserService,
    UserView,
    UserViewPagedCollectionStandardResponse,
} from 'src/services';
interface adminProps {
    adminList: UserViewPagedCollectionStandardResponse;
    client: UserView[];
}

function admin({ adminList, client }: adminProps) {
    //
    return <SupervisorManagement adminList={adminList} client={client} />;
}

export default admin;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const client = await UserService.listUsers('client', superAdminId);
            const data = await UserService.listUsers(
                'supervisor',
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
                    client: client?.data?.value,
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
