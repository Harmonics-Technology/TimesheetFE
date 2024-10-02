import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { OperationDashboard } from '@components/subpages/OperationalTask/OperationDashboard';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    DepartmentService,
    ProjectManagementService,
    ProjectProgressCountView,
    UserService,
} from 'src/services';

const OperationTask = ({
    projects,
    counts,
    users,
    superAdminId,
    userId,
    departments,
    userDepartments,
}: {
    projects: any;
    counts: ProjectProgressCountView;
    users: any;
    superAdminId: string;
    userId: string;
    departments: any;
    userDepartments?: any;
}) => {
    return (
        <OperationDashboard
            projects={projects}
            counts={counts}
            users={users}
            superAdminId={superAdminId}
            id={userId}
            departments={departments}
            userDepartments={userDepartments}
        />
    );
};

export default OperationTask;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        const userId = JSON.parse(ctx.req.cookies.user).id;
        const pagingOptions = filterPagingSearchOptions(ctx);

        try {
            const data = await ProjectManagementService.listOperationalTasks(
                superAdminId,
                undefined,
                pagingOptions.subId || userId,
                pagingOptions.search,
                pagingOptions.status,
                pagingOptions.department,
            );
            const users = await UserService.listUsersByRoles(
                superAdminId,
                'team member,super admin,admin,supervisor,payroll manager',
            );
            const userDepartments = await UserService.listUsersDepartment(
                userId,
            );
            const counts = 0;
            // await ProjectManagementService.getStatusCountForOperationalTask(
            //     superAdminId,
            // );
            const dept = await DepartmentService.listDepartments(superAdminId);

            // console.log({ users });

            return {
                props: {
                    projects: data.data,
                    users: users.data,
                    superAdminId,
                    counts,
                    userId,
                    departments: dept.data,
                    userDepartments: userDepartments.data,
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
