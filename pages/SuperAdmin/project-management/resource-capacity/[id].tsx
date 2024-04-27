import { ResourceDetailedView } from '@components/bits-utils/ProjectManagement/Projects/ResourceDetailedView';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import React from 'react';
import { ProjectManagementService } from 'src/services';

const singleResource = ({ resource, userName }) => {
    return <ResourceDetailedView resource={resource} userName={userName} />;
};

export default singleResource;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        // const superAdminId = JSON.parse(ctx.req.cookies.user).id;
        const { id } = ctx.query;
        const pagingOptions = filterPagingSearchOptions(ctx);
        const userName = ctx.req.cookies.userName;
        try {
            const data = await ProjectManagementService.getResourceDetails(
                pagingOptions.offset,
                pagingOptions.limit,
                id,
                pagingOptions.subId,
                pagingOptions.status,
                pagingOptions.search,
            );

            return {
                props: {
                    resource: data.data,
                    userName,
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
