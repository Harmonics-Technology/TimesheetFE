import { withPageAuth } from '@components/generics/withPageAuth';
import { BillingInfo } from '@components/subpages/BillingInfo';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import React from 'react';
import { Card, UserService, UtilityService } from 'src/services';

const Billing = ({ data, base }: { data: Card[]; base: any }) => {
    return <BillingInfo data={data} countries={base} />;
};

export default Billing;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const userId = JSON.parse(ctx.req.cookies.user).id;

        try {
            const data = await UserService.getUserCards(userId);
            const base = await UtilityService.listCountries();

            return {
                props: {
                    data: data.data?.data,
                    base: base.data,
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
