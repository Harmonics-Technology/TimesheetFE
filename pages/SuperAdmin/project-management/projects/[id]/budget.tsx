import { Budgets } from '@components/bits-utils/ProjectManagement/Projects/SingleProject/Budgets';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import { ProjectManagementService } from 'src/services';

const budget = ({ id, project, budgets }) => {
    return <Budgets id={id} project={project} budgets={budgets} />;
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
            return {
                props: {
                    project: data.data,
                    budgets: budgets.data,
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
