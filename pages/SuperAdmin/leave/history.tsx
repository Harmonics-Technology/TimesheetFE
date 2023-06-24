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
        // console.log({ id });
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
            const leavelist = await LeaveService.listLeaves(
                pagingOptions.offset,
                pagingOptions.limit,
                superAdminId,
                undefined,
                undefined,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
            );
            // console.log({ leavelist });
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
            console.log(error);
            return {
                props: {
                    data: [],
                },
            };
        }
    },
);
