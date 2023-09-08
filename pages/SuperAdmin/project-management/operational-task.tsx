import { OperationalTask } from '@components/bits-utils/ProjectManagement/OperationalTask';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import { ProjectManagementService, UserService } from 'src/services';

const OperationTask = ({
    projects,
    users,
    superAdminId,
}: {
    projects: any;
    users: any;
    superAdminId: string;
}) => {
    return (
        <OperationalTask
            projects={projects}
            users={users}
            superAdminId={superAdminId}
        />
    );
};

export default OperationTask;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).id;
        const pagingOptions = filterPagingSearchOptions(ctx);
        // console.log({ superAdminId });
        try {
            const data = await ProjectManagementService.listOperationalTasks(
                pagingOptions.offset,
                pagingOptions.limit,
                superAdminId,
                pagingOptions.status,
                pagingOptions.search,
            );
            const users = await UserService.listUsers(
                'Team Member',
                superAdminId,
                pagingOptions.offset,
                pagingOptions.limit || 50,
                pagingOptions.search,
            );

            return {
                props: {
                    projects: data.data,
                    users: users.data,
                    superAdminId,
                },
            };
        } catch (error: any) {
            console.log({ error });
            return {
                props: {
                    data: [],
                },
            };
        }
    },
);
