import { SingleTeamMember } from '@components/bits-utils/ProjectManagement/Projects/SingleProject/SingleTeamMember';
import { TeamSingleTeamPage } from '@components/bits-utils/ProjectManagement/Projects/TeamMember/TeamSingleTeamPage';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ProjectManagementService,
    UserService,
    UtilityService,
} from 'src/services';

const index = ({ id, teams, users, currencies, teamId }) => {
    return (
        <TeamSingleTeamPage
            id={id}
            teams={teams}
            users={users}
            currencies={currencies}
            teamId={teamId}
        />
    );
};

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        const pagingOptions = filterPagingSearchOptions(ctx);
        const { id } = ctx.query;
        const { teamId } = ctx.query;
        try {
            const data = await ProjectManagementService.getUserTasks(
                pagingOptions.offset,
                pagingOptions.limit,
                teamId,
                id,
            );
            const users = await UserService.listUsersByRoles(
                superAdminId,
                'team member,super admin,admin',
            );
            const currencies = await UtilityService.listCountries();
            return {
                props: {
                    teams: data.data,
                    users: users.data,
                    id,
                    teamId,
                    currencies: currencies.data,
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