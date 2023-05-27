import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import TeamManagement from '@components/subpages/TeamManagement';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    UserService,
    UserView,
    UserViewPagedCollectionStandardResponse,
} from 'src/services';
interface TeamProps {
    teamList: UserViewPagedCollectionStandardResponse;
    clients: UserView[];
    paymentPartner: UserView[];
}

function Team({ teamList, clients, paymentPartner }: TeamProps) {
    // console.log({ team });
    return (
        <TeamManagement
            adminList={teamList}
            clients={clients}
            paymentPartner={paymentPartner}
        />
    );
}

export default Team;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const data = await UserService.listUsers(
                'Team Member',
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
            );
            const clients = await UserService.listUsers('client');
            const paymentPartner = await UserService.listUsers(
                'payment partner',
            );
            return {
                props: {
                    teamList: data,
                    clients: clients?.data?.value,
                    paymentPartner: paymentPartner?.data?.value,
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
