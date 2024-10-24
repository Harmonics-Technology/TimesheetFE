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
    subs: any;
}

function admin({ adminList, team, subs }: adminProps) {
    //
    return (
        <ProfileManagementAdmin
            adminList={adminList}
            team={team}
            isSuperAdmin
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
            const team = await UserService.listUsers({
                role: 'Team Member',
                superAdminId,
            });
            const data = await UserService.listUsers({
                role: 'admins',
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
                    team: team?.data?.value,
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
