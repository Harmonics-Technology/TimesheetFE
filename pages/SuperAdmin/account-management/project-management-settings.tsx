import { withPageAuth } from '@components/generics/withPageAuth';
import { ProjectMgtAccess } from '@components/subpages/ProjectMgtAccess';
import { GetServerSideProps } from 'next';
import React from 'react';
import { UserService } from 'src/services';

const ProjectManagementSettings = ({ data }: { data: any }) => {
    return <ProjectMgtAccess controls={data} />;
};

export default ProjectManagementSettings;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data =
                await UserService.getSuperAdminProjectManagementSettings(
                    superAdminId,
                );
            return {
                props: {
                    data: data.data,
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
