import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import TeamManagement from '@components/subpages/TeamManagement';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    LeaveConfigurationView,
    LeaveService,
    UserService,
    UserView,
    UserViewPagedCollectionStandardResponse,
} from 'src/services';
interface TeamProps {
    teamList: UserViewPagedCollectionStandardResponse;
    clients: UserView[];
    paymentPartner: UserView[];
    leaveSettings: LeaveConfigurationView;
    subs: any;
}

function Team({
    teamList,
    clients,
    paymentPartner,
    leaveSettings,
    subs,
}: TeamProps) {
    //
    return (
        <TeamManagement
            adminList={teamList}
            clients={clients}
            paymentPartner={paymentPartner}
            leaveSettings={leaveSettings}
            isSuperAdmin
            subs={subs}
        />
    );
}

export default Team;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await UserService.listUsers(
                'Team Member',
                superAdminId,
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
            );
            const clients = await UserService.listUsers('client', superAdminId);
            const subs = await UserService.getClientSubScriptions(superAdminId);
            const paymentPartner = await UserService.listUsers(
                'payment partner',
                superAdminId,
            );
            const leaveSettings = await LeaveService.getLeaveConfiguration(
                superAdminId,
            );
            return {
                props: {
                    teamList: data,
                    clients: clients?.data?.value,
                    paymentPartner: paymentPartner?.data?.value,
                    leaveSettings: leaveSettings.data,
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
