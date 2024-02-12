import { PurchaseLicense } from '@components/subpages/ManageSub/PurchaseLicense';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import React from 'react';
import { OpenAPI } from 'src/services';

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

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
    OpenAPI.BASE = 'https://pi-commandcenterdev.azurewebsites.net';
    OpenAPI.TOKEN = ctx.req.cookies.token;
    const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
    try {
        const base = await axios.get(
            `${OpenAPI.BASE}/api/Subscription/subscriptions`,
        );

        return {
            props: {
                base: base.data.data,
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
};
