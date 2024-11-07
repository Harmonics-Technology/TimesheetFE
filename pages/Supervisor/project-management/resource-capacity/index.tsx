import { ResourceView } from '@components/bits-utils/ProjectManagement/Projects/ResourceView';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import { ProjectManagementService } from 'src/services';

const resources = ({ resources }) => {
    return <ResourceView resources={resources} />;
};

export default resources;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const data =
                await ProjectManagementService.getResourcesCapacityOverview(
                    pagingOptions.offset,
                    pagingOptions.limit,
                    superAdminId,
                    pagingOptions.from,
                    pagingOptions.to,
                );

            return {
                props: {
                    resources: data.data,
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
