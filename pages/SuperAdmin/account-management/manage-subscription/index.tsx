import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { LicenseHome } from '@components/subpages/ManageSub/LicenseHome';
import { GetServerSideProps } from 'next';
import React from 'react';
import { UserService } from 'src/services';

const manageSubscription = ({ data, subs, users, superAdminId }) => {
    return (
        <LicenseHome
            data={data}
            subs={subs}
            users={users}
            superAdminId={superAdminId}
        />
    );
};

export default manageSubscription;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await UserService.getClientInvoices(
                superAdminId,
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
            );
            const subs = await UserService.getClientSubScriptions(superAdminId);
            const subId =
                pagingOptions.subId || (subs as any)?.data[0].subscriptionId;
            const users = await UserService.listUsers(
                //@ts-ignore
                undefined,
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
                    data: data.data?.data,
                    subs: subs.data,
                    users: users,
                    superAdminId,
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
