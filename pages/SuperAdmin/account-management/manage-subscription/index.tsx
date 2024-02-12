import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { LicenseHome } from '@components/subpages/ManageSub/LicenseHome';
import { GetServerSideProps } from 'next';
import React from 'react';
import { UserService } from 'src/services';

const manageSubscription = ({ data, subs, users }) => {
    return <LicenseHome data={data} subs={subs} users={users} />;
};

export default manageSubscription;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            // const data = await UserService.getClientSubscriptionHistory(
            //     superAdminId,
            //     pagingOptions.search,
            // );
            const subs = await UserService.getClientSubScriptions(superAdminId);
            const subId =
                pagingOptions.subId || (subs as any)?.data[0].subscriptionId;
            const users = await UserService.listUsers(
                'Team Member',
                superAdminId,
                pagingOptions.offset,
                pagingOptions.limit || 50,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
                subId,
            );
            return {
                props: {
                    // data: data.data?.data,
                    subs: subs.data,
                    users: users.data,
                    // data: [],
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
