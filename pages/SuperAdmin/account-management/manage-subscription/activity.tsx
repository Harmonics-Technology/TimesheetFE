import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { LicenseActivity } from '@components/subpages/ManageSub/LicenseActivity';
import { GetServerSideProps } from 'next';
import React from 'react';
import { UserService } from 'src/services';

const manageSubscription = ({ data }) => {
    return <LicenseActivity data={data} />;
};

export default manageSubscription;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await UserService.userLicenseUpdatesAuditLogs(
                pagingOptions.offset,
                pagingOptions.limit || 10,
                superAdminId,
                pagingOptions.clientId,
                pagingOptions.from,
                pagingOptions.to,
            );

            return {
                props: {
                    data: data.data,
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
