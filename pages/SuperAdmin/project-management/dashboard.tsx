import React from 'react';
import { Dashboard } from '@components/bits-utils/ProjectManagement/Dashboard';
import { withPageAuth } from '@components/generics/withPageAuth';
import { GetServerSideProps } from 'next';
import { ProjectManagementService } from 'src/services';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';

const dashboard = () => {
    return <Dashboard />;
};

export default dashboard;

// export const getServerSideProps: GetServerSideProps = withPageAuth(
//     async (ctx: any) => {
//         const superAdminId = JSON.parse(ctx.req.cookies.user).id;
//         const pagingOptions = filterPagingSearchOptions(ctx);
//         // console.log({ superAdminId });
//         try {
//             const data = await ProjectManagementService.listProject(
//                 pagingOptions.offset,
//                 pagingOptions.limit,
//                 superAdminId,
//                 pagingOptions.status || 1,
//                 pagingOptions.search,
//             );
//             return {
//                 props: {
//                     projects: data.data,
//                 },
//             };
//         } catch (error: any) {
//             console.log({ error });
//             return {
//                 props: {
//                     data: [],
//                 },
//             };
//         }
//     },
// );
