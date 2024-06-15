import { TeamProjectPage } from '@components/bits-utils/ProjectManagement/Projects/TeamMember/ProjectPage';
import { ProjectPage } from '@components/bits-utils/ProjectManagement/Projects';

import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ProjectManagementService,
    UserService,
    UtilityService,
} from 'src/services';

const projectsIndex = ({
    iProjects,
    nProjects,
    cProjects,
    projects,
    users,
    superAdminId,
    counts,
    access,
    isPm,
    projectMangers,
    currencies,
}: {
    iProjects: any;
    nProjects: any;
    cProjects: any;
    projects: any;
    users: any;
    superAdminId: string;
    counts: any;
    access: any;
    isPm: boolean;
    projectMangers: any;
    currencies: any;
}) => {
    return (
        <>
            {isPm ? (
                <ProjectPage
                    iProjects={iProjects}
                    nProjects={nProjects}
                    cProjects={cProjects}
                    users={users}
                    superAdminId={superAdminId}
                    counts={counts}
                    projectMangers={projectMangers}
                    access={access}
                    isPm
                    currencies={currencies}
                />
            ) : (
                <TeamProjectPage
                    projects={projects}
                    users={users}
                    superAdminId={superAdminId}
                    counts={counts}
                    access={access}
                    projectMangers={projectMangers}
                    currencies={currencies}
                />
            )}
        </>
    );
};

export default projectsIndex;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const user = JSON.parse(ctx.req.cookies.user);
        const superAdminId = user.superAdminId;
        const userId = user.id;
        const pagingOptions = filterPagingSearchOptions(ctx);
        const isPm = user.isOrganizationProjectManager;
        const fetchProjectByStatus = (status) => {
            const data = ProjectManagementService.listStrippedProject(
                pagingOptions.offset,
                pagingOptions.limit,
                superAdminId,
                status,
                undefined,
                pagingOptions.search,
            );
            return data;
        };
        //
        try {
            const nProgress = await fetchProjectByStatus(1);
            const iProgress = await fetchProjectByStatus(2);
            const cProgress = await fetchProjectByStatus(3);
            const data = await ProjectManagementService.listStrippedProject(
                pagingOptions.offset,
                pagingOptions.limit,
                superAdminId,
                pagingOptions.status,
                userId,
                pagingOptions.search,
            );
            const users = await UserService.listUsers(
                'Team Member',
                superAdminId,
                pagingOptions.offset,
                80,
                pagingOptions.search,
            );

            const access =
                await UserService.getSuperAdminProjectManagementSettings(
                    superAdminId,
                );
            const counts =
                await ProjectManagementService.getStatusCountForProject(
                    superAdminId,
                    userId,
                );
            const currencies = await UtilityService.listCountries();
            // const projectMangers = await UserService.listUsers(
            //     //@ts-ignore
            //     undefined,
            //     superAdminId,
            //     pagingOptions.offset,
            //     pagingOptions.limit || 50,
            //     pagingOptions.search,
            //     pagingOptions.from,
            //     pagingOptions.to,
            //     undefined,
            //     true,
            // );

            return {
                props: {
                    projects: data.data,
                    superAdminId,
                    counts: counts.data,
                    users: users.data,
                    access: access.data,
                    // projectMangers: projectMangers.data,
                    isPm,
                    iProjects: iProgress.data,
                    nProjects: nProgress.data,
                    cProjects: cProgress.data,
                    currencies: currencies.data,
                },
            };
        } catch (error: any) {
            return {
                props: {
                    projects: [],
                    users: [],
                },
            };
        }
    },
);
