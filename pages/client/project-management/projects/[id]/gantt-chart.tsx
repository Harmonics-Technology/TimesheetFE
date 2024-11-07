import { GantChart } from '@components/bits-utils/ProjectManagement/Projects/SingleProject/GantChart';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ProjectManagementService,
    UserService,
    UtilityService,
} from 'src/services';

const index = ({ id, project, tasks, users, currencies }) => {
    return (
        <GantChart
            id={id}
            project={project}
            tasks={tasks}
            users={users}
            currencies={currencies}
        />
    );
};

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        const pagingOptions = filterPagingSearchOptions(ctx);
        const { id } = ctx.query;
        try {
            const data = await ProjectManagementService.getProject(id);
            const tasks = await ProjectManagementService.listTasks(
                pagingOptions.offset,
                pagingOptions.limit,
                superAdminId,
                id,
                pagingOptions.status,
                undefined,
                pagingOptions.search,
            );
            const users = await UserService.listUsersByRoles(
                superAdminId,
                'team member,super admin,admin',
            );
            const currencies = await UtilityService.listCountries();

            return {
                props: {
                    project: data.data,
                    id,
                    tasks: tasks.data,
                    users: users.data,
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
