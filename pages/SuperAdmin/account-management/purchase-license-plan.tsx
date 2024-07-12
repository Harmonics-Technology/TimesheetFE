import { withPageAuth } from '@components/generics/withPageAuth';
import { PurchaseLicense } from '@components/subpages/ManageSub/PurchaseLicense';
import { GetServerSideProps } from 'next';
import React from 'react';
import { OpenAPI, UserService } from 'src/services';

const PurchaseLicensePage = ({
    base,
    superAdminId,
}: {
    base: any;
    superAdminId: string;
}) => {
    return <PurchaseLicense base={base} superAdminId={superAdminId} />;
};

export default PurchaseLicensePage;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const base = await UserService.getSubscriptionTypes();

            return {
                props: {
                    base: base.data?.data,
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
