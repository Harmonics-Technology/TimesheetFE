import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import PaymentPartnerTeamManagement from '@components/subpages/PaymentpartnerTeamManagement';
import TeamManagement from '@components/subpages/TeamManagement';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    LeaveService,
    UserService,
    UserView,
    UserViewPagedCollectionStandardResponse,
} from 'src/services';
interface TeamProps {
    teamList: UserViewPagedCollectionStandardResponse;
    clients: UserView[];
    id: string;
}

function Team({ teamList, clients, id }: TeamProps) {
    //
    return (
        <PaymentPartnerTeamManagement
            adminList={teamList}
            clients={clients}
            id={id}
        />
    );
}

export default Team;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const id = JSON.parse(ctx.req.cookies.user).id;
        //
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const clients = await UserService.listUsers(
                'client',
                superAdminId,
                pagingOptions.offset,
                40,
                pagingOptions.search,
            );
            const data = await UserService.getPaymentPartnerTeamMembers(
                pagingOptions.offset,
                40,
                pagingOptions.search,
                id,
                // pagingOptions.from,
                // pagingOptions.to,
            );

            return {
                props: {
                    teamList: data,
                    clients: clients?.data?.value,
                    id,
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
