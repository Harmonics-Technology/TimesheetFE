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
    // console.log({ team });
    return <SupervisorManagement adminList={adminList} client={client} />;
}

export default admin;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const client = await UserService.listUsers('client');
            const data = await UserService.listUsers(
                'supervisor',
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                pagingOptions.date,
            );
            return {
                props: {
                    adminList: data,
                    client: client?.data?.value,
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
