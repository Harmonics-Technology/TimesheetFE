import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import TeamManagement from '@components/subpages/TeamManagement';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    DepartmentService,
    LeaveConfigurationView,
    LeaveService,
    UserService,
    UserView,
    UserViewPagedCollectionStandardResponse,
    UtilityService,
} from 'src/services';
interface TeamProps {
    teamList: UserViewPagedCollectionStandardResponse;
    clients: UserView[];
    paymentPartner: UserView[];
    leaveSettings: LeaveConfigurationView;
    subs: any;
    currencies: any;
    department: any;
}

function Team({
    teamList,
    clients,
    paymentPartner,
    leaveSettings,
    subs,
    currencies,
    department,
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
            currencies={currencies}
            department={department}
        />
    );
}

export default Team;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await UserService.listUsers({
                role: 'Team Member',
                superAdminId,
                offset: pagingOptions.offset,
                limit: pagingOptions.limit,
                role: pagingOptions.search,
                search: pagingOptions.from,
                startDate: pagingOptions.to,
            });
            const clients = await UserService.listUsers({
                role: 'client',
                superAdminId,
            });
            const subs = await UserService.getClientSubScriptions(superAdminId);
            const paymentPartner = await UserService.listUsers({
                role: 'payment partner',
                superAdminId,
            });
            const leaveSettings = await LeaveService.getLeaveConfiguration(
                superAdminId,
            );
            const department = await DepartmentService.listDepartments(
                superAdminId,
            );
            const currencies = await UtilityService.listCountries();
            return {
                props: {
                    teamList: data,
                    clients: clients?.data?.value,
                    paymentPartner: paymentPartner?.data?.value,
                    leaveSettings: leaveSettings.data,
                    subs: subs.data,
                    currencies: currencies.data,
                    department: department.data,
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
