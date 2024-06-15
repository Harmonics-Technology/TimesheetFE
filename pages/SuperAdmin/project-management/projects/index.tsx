import { ProjectPage } from '@components/bits-utils/ProjectManagement/Projects';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ProjectManagementService,
    ProjectProgressCountView,
    UserService,
    UtilityService,
} from 'src/services';

const projectsIndex = ({
    iProjects,
    nProjects,
    cProjects,
    users,
    superAdminId,
    counts,
    projectMangers,
    access,
    currencies,
}: {
    iProjects: any;
    nProjects: any;
    cProjects: any;
    users: any;
    superAdminId: string;
    counts: ProjectProgressCountView;
    projectMangers: any;
    access: any;
    currencies: any;
}) => {
    return (
        <ProjectPage
            iProjects={iProjects}
            nProjects={nProjects}
            cProjects={cProjects}
            users={users}
            superAdminId={superAdminId}
            counts={counts}
            projectMangers={projectMangers}
            access={access}
            isPm={false}
            currencies={currencies}
        />
    );
};

export default projectsIndex;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).id;
        const pagingOptions = filterPagingSearchOptions(ctx);
        //
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
        try {
            const nProgress = await fetchProjectByStatus(1);
            const iProgress = await fetchProjectByStatus(2);
            const cProgress = await fetchProjectByStatus(3);
            const users = await UserService.listUsers(
                'Team Member',
                superAdminId,
                pagingOptions.offset,
                80,
                pagingOptions.search,
            );
            const counts =
                await ProjectManagementService.getStatusCountForProject(
                    superAdminId,
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
            const access =
                await UserService.getSuperAdminProjectManagementSettings(
                    superAdminId,
                );
            //
            return {
                props: {
                    iProjects: iProgress.data,
                    nProjects: nProgress.data,
                    cProjects: cProgress.data,
                    users: users.data,
                    superAdminId,
                    counts: counts.data,
                    // projectMangers: projectMangers.data,
                    access: access.data,
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
