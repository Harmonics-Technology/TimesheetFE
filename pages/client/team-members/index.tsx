import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import ClientTeamManagement from '@components/subpages/ClientTeamManagement';
import TeamManagement from '@components/subpages/TeamManagement';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    UserService,
    UserView,
    UserViewPagedCollectionStandardResponse,
    UserViewStandardResponse,
} from 'src/services';
interface TeamProps {
    teamList: UserViewPagedCollectionStandardResponse;
    id: string;
    paymentPartner: UserView[];
    supervisor: UserView[];
}

function Team({ teamList, id, paymentPartner, supervisor }: TeamProps) {
    ({ teamList });
    return (
        <ClientTeamManagement
            adminList={teamList}
            id={id}
            paymentPartner={paymentPartner}
            supervisor={supervisor}
        />
    );
}

export default Team;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const id = JSON.parse(ctx.req.cookies.user).id;
        try {
            const paymentPartner = await UserService.listUsers(
                'payment partner',
            );
            const data = await UserService.getClientTeamMembers(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                id,
                pagingOptions.from,
                pagingOptions.to,
            );
            const supervisor = await UserService.getClientSupervisors(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                id,
            );
            return {
                props: {
                    teamList: data,
                    id: id,
                    supervisor: supervisor.data,
                    paymentPartner: paymentPartner?.data?.value,
                },
            };
        } catch (error: any) {
            (error);
            return {
                props: {
                    data: [],
                },
            };
        }
    },
);
