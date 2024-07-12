import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import TeamDrafts from '@components/subpages/TeamDrafts';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    DepartmentService,
    DraftService,
    LeaveConfigurationView,
    LeaveService,
    UserDraftViewPagedCollectionStandardResponse,
    UserService,
    UserView,
    UtilityService,
} from 'src/services';
interface TeamProps {
    drafts: UserDraftViewPagedCollectionStandardResponse;
    clients: UserView[];
    paymentPartner: UserView[];
    leaveSettings: LeaveConfigurationView;
    subs: any;
    currencies: any;
    department: any;
}

function TeamDraft({
    drafts,
    clients,
    paymentPartner,
    leaveSettings,
    subs,
    currencies,
    department,
}: TeamProps) {
    //
    return (
        <TeamDrafts
            drafts={drafts}
            clients={clients}
            paymentPartner={paymentPartner}
            leaveSettings={leaveSettings}
            subs={subs}
            currencies={currencies}
            department={department}
        />
    );
}

export default TeamDraft;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await DraftService.listDrafts(
                pagingOptions.offset,
                pagingOptions.limit,
                superAdminId,
                'Team Member',
            );
            const subs = await UserService.getClientSubScriptions(superAdminId);
            const clients = await UserService.listUsers('client', superAdminId);
            const paymentPartner = await UserService.listUsers(
                'payment partner',
                superAdminId,
            );
            const leaveSettings = await LeaveService.getLeaveConfiguration(
                superAdminId,
            );
            const department = await DepartmentService.listDepartments(
                superAdminId,
            );
            const currencies = await UtilityService.listCountries();
           

            return {
                props: {
                    drafts: data,
                    clients: clients?.data?.value,
                    paymentPartner: paymentPartner?.data?.value,
                    leaveSettings: leaveSettings.data,
                    subs: subs.data,
                    currencies: currencies.data,
                    department: department.data,
                },
            };
        } catch (error: any) {
            // console.log({ error });
            return {
                props: {
                    data: [],
                },
            };
        }
    },
);