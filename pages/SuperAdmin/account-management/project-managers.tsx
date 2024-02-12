import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { ProjectManagementSettings } from '@components/subpages/ProjectManagementSettings';
import { GetServerSideProps } from 'next';
import React from 'react';
import { UserService } from 'src/services';

const project = ({ data, pm }: { data: any; pm: any }) => {
    return <ProjectManagementSettings data={data} pm={pm} />;
};

export default project;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        // const subId = JSON.parse(ctx.req.cookies.user).subscriptiobDetails.data.id;
        // console.log({subId})
        try {
            const data = await UserService.listUsers(
                'Team Member',
                superAdminId,
                pagingOptions.offset,
                pagingOptions.limit || 50,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
            );
            const pm = await UserService.listUsers(
                'Team Member',
                superAdminId,
                pagingOptions.offset,
                pagingOptions.limit || 50,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
                undefined,
                true,
            );

            return {
                props: {
                    data: data.data,
                    pm,
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
