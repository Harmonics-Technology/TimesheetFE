import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { SubscriptionDetails } from '@components/subpages/SubscriptionDetails';
import { GetServerSideProps } from 'next';
import React from 'react';
import { UserService } from 'src/services';

const manageSubscription = ({ data }) => {
    return <SubscriptionDetails data={data} />;
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
            // console.log({ data });
            return {
                props: {
                    data: data.data?.data,
                    // data: [],
                },
            };
        } catch (error: any) {
            console.log(error);
            return {
                props: {
                    data: [],
                },
            };
        }
    },
);
