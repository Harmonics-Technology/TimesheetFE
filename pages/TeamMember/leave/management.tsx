import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { LeaveManagement } from '@components/subpages/LeaveManagement';
import { GetServerSideProps } from 'next';
import React from 'react';
import { LeaveService, UserService } from 'src/services';

const index = ({ teamMembers, supervisor, leavelist, leavetypes, id }) => {
    return (
        <LeaveManagement
            teamMembers={teamMembers}
            supervisor={supervisor}
            leavelist={leavelist}
            leavetypes={leavetypes}
            id={id}
            type={'asTeam'}
        />
    );
};

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const id = JSON.parse(ctx.req.cookies.user).employeeInformationId;
        const clientId = JSON.parse(ctx.req.cookies.user).clientId;
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        //
        try {
            // const teamMembers = await UserService.getClientTeamMembers(
            //     pagingOptions.offset,
            //     100,
            //     pagingOptions.search,
            //     clientId,
            //     pagingOptions.from,
            //     pagingOptions.to,
            // );
            const users = await UserService.listUsersByRoles(
                superAdminId,
                'team member,super admin,admin,supervisor',
            );
            // const supervisor = await UserService.getClientSupervisors(
            //     pagingOptions.offset,
            //     25,
            //     pagingOptions.search,
            //     clientId,
            // );
            // const leavelist = await LeaveService.listLeaves(
            //     pagingOptions.offset,
            //     pagingOptions.limit,
            //     superAdminId,
            //     undefined,
            //     id,
            //     pagingOptions.search,
            //     pagingOptions.from,
            //     pagingOptions.to,
            // );
            const leavelist = await LeaveService.listAllPendingLeaves(
                pagingOptions.offset,
                pagingOptions.limit,
                superAdminId,
                undefined,
                id,
            );
            const leavetypes = await LeaveService.leaveTypes(
                pagingOptions.offset,
                pagingOptions.limit,
                superAdminId,
            );

            return {
                props: {
                    teamMembers: { data: { value: users?.data } },
                    id: id,
                    // supervisor: supervisor.data,
                    leavelist,
                    leavetypes: leavetypes.data,
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
