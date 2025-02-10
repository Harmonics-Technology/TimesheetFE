import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import CollaboratorManagement from '@components/subpages/Collaborator/CollaboratorManagement';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    UserService,
    UserViewPagedCollectionStandardResponse,
} from 'src/services';
interface adminProps {
    data: UserViewPagedCollectionStandardResponse;
    subs: any;
}

function collaborator({ data, subs }: adminProps) {
    //
    return <CollaboratorManagement userList={data} isSuperAdmin subs={subs} />;
}

export default collaborator;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await UserService.listUsers(
                'Collaborator',
                superAdminId,
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
            );
            const subs = await UserService.getClientSubScriptions(superAdminId);
            return {
                props: {
                    data,
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
