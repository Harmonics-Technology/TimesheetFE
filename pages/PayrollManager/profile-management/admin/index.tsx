import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import ProfileManagementAdmin from '@components/subpages/AdminManagement';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ExportService,
    UserService,
    UserView,
    UserViewPagedCollectionStandardResponse,
} from 'src/services';
interface adminProps {
    adminList: UserViewPagedCollectionStandardResponse;
    team: UserView[];
}

function admin({ adminList, team }: adminProps) {
    // console.log({ team });
    return <ProfileManagementAdmin adminList={adminList} team={team} />;
}

export default admin;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const team = await UserService.listUsers(
                'Team Member',
                superAdminId,
            );
            const data = await UserService.listUsers(
                'admins',
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
                    team: team?.data?.value,
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
