import { SingleTeamMember } from '@components/bits-utils/ProjectManagement/Projects/SingleProject/SingleTeamMember';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import { ProjectManagementService } from 'src/services';

const index = ({ id, teams }) => {
    return <SingleTeamMember id={id} teams={teams} />;
};

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).id;
        const pagingOptions = filterPagingSearchOptions(ctx);
        const { id } = ctx.query;
        const { teamId } = ctx.query;
        try {
            const data = await ProjectManagementService.getUserTasks(
                pagingOptions.offset,
                pagingOptions.limit,
                teamId,
                id,
            );
            return {
                props: {
                    teams: data.data,
                    id,
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
