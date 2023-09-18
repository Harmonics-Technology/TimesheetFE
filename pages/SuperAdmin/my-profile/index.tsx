import { withPageAuth } from '@components/generics/withPageAuth';
import MyProfile from '@components/subpages/MyProfile';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    FinancialService,
    PaymentScheduleListStandardResponse,
    UserService,
    UserView,
} from 'src/services';

function index({
    user,
    paymentSchedule,
}: {
    user: UserView;
    paymentSchedule: PaymentScheduleListStandardResponse;
}) {
    return <MyProfile user={user} paymentSchedule={paymentSchedule} />;
}

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const id = JSON.parse(ctx.req.cookies.user).id;
        try {
            const data = await UserService.getUserById(id);
            const paymentSchedule =
                await FinancialService.getPaymentSchedules();
            return {
                props: {
                    user: data.data,
                    paymentSchedule,
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
