import { DocumentsPage } from '@components/bits-utils/ProjectManagement/Projects/SingleProject/DocumentsPage';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ProjectManagementService,
    UserService,
    UtilityService,
} from 'src/services';

const index = ({ id, project, files, users, currencies }) => {
    return (
        <DocumentsPage
            id={id}
            project={project}
            files={files}
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
            const files = await ProjectManagementService.listAttachments(id);
            const users = await UserService.listUsersByRoles(
                superAdminId,
                'team member,super admin,admin,client,supervisor',
            );
            const currencies = await UtilityService.listCountries();

            return {
                props: {
                    project: data.data,
                    id,
                    files: files.data,
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
