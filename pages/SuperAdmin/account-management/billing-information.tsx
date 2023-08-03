import { withPageAuth } from '@components/generics/withPageAuth';
import { BillingInfo } from '@components/subpages/BillingInfo';
import { GetServerSideProps } from 'next';
import React from 'react';
import { Card, UserService } from 'src/services';

const Billing = ({ data }: { data: Card[] }) => {
    return <BillingInfo data={data} />;
};

export default Billing;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const userId = JSON.parse(ctx.req.cookies.user).id;
        console.log({ userId });
        try {
            const data = await UserService.getUserCards(userId);
            console.log({ data });
            return {
                props: {
                    data: data.data?.data,
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
