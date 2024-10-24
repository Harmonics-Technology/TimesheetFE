import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { LicenseHome } from '@components/subpages/ManageSub/LicenseHome';
import { GetServerSideProps } from 'next';
import React from 'react';
import { UserService } from 'src/services';

const manageSubscription = ({ data, subs, users, superAdminId, subId }) => {
    return (
        <LicenseHome
            data={data}
            subs={subs}
            users={users}
            superAdminId={superAdminId}
            subId={subId}
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
                pagingOptions.subId ||
                (subs as any)?.data[0].subscriptionId ||
                '';
            const users = await UserService.listUsers({
                //@ts-ignore
                role: undefined,
                superAdminId,
                offset: pagingOptions.offset,
                limit: pagingOptions.limit || 50,
                role: pagingOptions.search,
                search: pagingOptions.from,
                startDate: pagingOptions.to,
                endDate: subId,
            });
            return {
                props: {
                    data: data.data?.data,
                    subs: subs.data,
                    users: users,
                    superAdminId,
                    subId,
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
