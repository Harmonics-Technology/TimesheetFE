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
            type={'asAdmin'}
        />
    );
};

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const id = JSON.parse(ctx.req.cookies.user).id;
        const clientId = JSON.parse(ctx.req.cookies.user).clientId;
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        //
        try {
            // const teamMembers = await UserService.getClientTeamMembers(
            //     pagingOptions.offset,
            //     25,
            //     pagingOptions.search,
            //     clientId,
            //     pagingOptions.from,
            //     pagingOptions.to,
            // );
            // const supervisor = await UserService.getClientSupervisors(
            //     pagingOptions.offset,
            //     25,
            //     pagingOptions.search,
            //     clientId,
            // );
            const leavelist = await LeaveService.listCanceledLeave(
                pagingOptions.offset,
                pagingOptions.limit,
                superAdminId,
                id
                // undefined,
                // undefined,
                // pagingOptions.search,
                // pagingOptions.from,
                // pagingOptions.to,
            );
            //
            // const leavetypes = await LeaveService.leaveTypes(
            //     pagingOptions.offset,
            //     pagingOptions.limit,
            // );
            return {
                props: {
                    // teamMembers,
                    id: id,
                    // supervisor: supervisor.data,
                    leavelist,
                    // leavetypes: leavetypes.data,
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
