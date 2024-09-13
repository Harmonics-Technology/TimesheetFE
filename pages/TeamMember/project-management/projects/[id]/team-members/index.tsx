import { TeamMembersView } from '@components/bits-utils/ProjectManagement/Projects/SingleProject/TeamMembersView';
import { TeamMemberAllView } from '@components/bits-utils/ProjectManagement/Projects/TeamMember/TeamMemberAllView';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ProjectManagementService,
    UserService,
    UtilityService,
} from 'src/services';

const index = ({ id, teams, users, currencies }) => {
    return (
        <TeamMemberAllView
            id={id}
            teams={teams}
            users={users}
            currencies={currencies}
        />
    );
};

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).id;
        const pagingOptions = filterPagingSearchOptions(ctx);
        const { id } = ctx.query;
        try {
            const data = await ProjectManagementService.getProject(id);
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