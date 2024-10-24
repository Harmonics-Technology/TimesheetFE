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
    subs: any;
}

function admin({ adminList, client, subs }: adminProps) {
    //
    return (
        <SupervisorManagement
            adminList={adminList}
            client={client}
            subs={subs}
        />
    );
}

export default admin;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const client = await UserService.listUsers({
                role: 'client',
                superAdminId,
            });
            const data = await UserService.listUsers({
                role: 'supervisor',
                superAdminId,
                offset: pagingOptions.offset,
                limit: pagingOptions.limit,
                role: pagingOptions.search,
                search: pagingOptions.from,
                startDate: pagingOptions.to,
            });
            const subs = await UserService.getClientSubScriptions(superAdminId);
            return {
                props: {
                    adminList: data,
                    client: client?.data?.value,
                    subs: subs.data,
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
