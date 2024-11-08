import { TeamDocumentsPage } from '@components/bits-utils/ProjectManagement/Projects/SingleProject/TeamDocumentPage';
// import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import { ProjectManagementService } from 'src/services';

const index = ({ id, project, files }) => {
    return <TeamDocumentsPage id={id} project={project} files={files} />;
};

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        // const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        // const pagingOptions = filterPagingSearchOptions(ctx);
        const { id } = ctx.query;
        try {
            const data = await ProjectManagementService.getProject(id);
            const files = await ProjectManagementService.listAttachments(id);

            return {
                props: {
                    project: data.data,
                    id,
                    files: files.data,
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
