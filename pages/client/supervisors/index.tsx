import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import SupervisorManagement from '@components/subpages/ClientSupervisor';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    UserService,
    UserView,
    UserViewPagedCollectionStandardResponse,
} from 'src/services';
interface adminProps {
    adminList: UserViewPagedCollectionStandardResponse;
    clientId: any;
}

function admin({ adminList, clientId }: adminProps) {
    // console.log({ team });
    return <SupervisorManagement adminList={adminList} clientId={clientId} />;
}

export default admin;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const clientId = JSON.parse(ctx.req.cookies.user).id;
        try {
            const data = await UserService.getClientSupervisors(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                clientId,
                pagingOptions.from,
                pagingOptions.to,
            );
            return {
                props: {
                    adminList: data,
                    clientId,
                },
            };
        } catch (error: any) {
            console.log(error);
            return {
                props: {
                    data: [],
                },
            };
        }
    },
);
