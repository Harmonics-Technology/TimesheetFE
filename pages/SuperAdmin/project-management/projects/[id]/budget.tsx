import { Budgets } from '@components/bits-utils/ProjectManagement/Projects/SingleProject/Budgets';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ProjectManagementService,
    UserService,
    UtilityService,
} from 'src/services';

const budget = ({ id, project, budgets, users, currencies }) => {
    return (
        <Budgets
            id={id}
            project={project}
            budgets={budgets}
            users={users}
            currencies={currencies}
        />
    );
};

export default budget;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).id;
        const pagingOptions = filterPagingSearchOptions(ctx);
        const { id } = ctx.query;
        try {
            const data = await ProjectManagementService.getProject(id);
            const budgets =
                await ProjectManagementService.listProjectAssigneeDetail(
                    pagingOptions.offset,
                    pagingOptions.limit,
                    id,
                );
            const users = await UserService.listUsersByRoles(
                superAdminId,
                'team member,super admin,admin',
            );
            const currencies = await UtilityService.listCountries();
            return {
                props: {
                    project: data.data,
                    budgets: budgets.data,
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
