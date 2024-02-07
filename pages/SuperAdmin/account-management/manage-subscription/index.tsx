import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { LicenseHome } from '@components/subpages/ManageSub/LicenseHome';
import { SubscriptionDetails } from '@components/subpages/SubscriptionDetails';
import { GetServerSideProps } from 'next';
import React from 'react';
import { UserService } from 'src/services';

const manageSubscription = ({ data }) => {
    return <LicenseHome data={data} />;
};

export default manageSubscription;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await UserService.getClientSubscriptionHistory(
                superAdminId,
                pagingOptions.search,
            );
            //
            return {
                props: {
                    data: data.data?.data,
                    // data: [],
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
