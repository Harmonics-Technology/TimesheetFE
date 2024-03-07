// import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { DepartmentPage } from '@components/subpages/DepartmentPage';
import { GetServerSideProps } from 'next';
import React from 'react';
import { UserService } from 'src/services';

const project = ({ data, superAdminId }: { data: any; superAdminId: any }) => {
    return <DepartmentPage data={data} superAdminId={superAdminId} />;
};

export default project;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        // const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;

        try {
            const data = await UserService.getControlSettingById(superAdminId);

            return {
                props: {
                    data: data.data,
                    superAdminId,
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
