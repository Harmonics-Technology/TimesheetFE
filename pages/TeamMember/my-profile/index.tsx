import { withPageAuth } from '@components/generics/withPageAuth';
import MyProfile from '@components/subpages/MyProfile';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ControlSettingView,
    FinancialService,
    PaymentScheduleListStandardResponse,
    UserService,
    UserView,
} from 'src/services';

function index({
    user,
    paymentSchedule,
    controls,
}: {
    user: UserView;
    paymentSchedule: PaymentScheduleListStandardResponse;
    controls: ControlSettingView;
}) {
    return (
        <MyProfile
            user={user}
            paymentSchedule={paymentSchedule}
            controls={controls}
        />
    );
}

export default index;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const id = JSON.parse(ctx.req.cookies.user).id;
        const employeeId = JSON.parse(
            ctx.req.cookies.user,
        ).employeeInformationId;
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await UserService.getUserById(id);
            // const paymentSchedule =
            //     await FinancialService.getEmployeePaymentSchedule(employeeId);
            const controls = await UserService.getControlSettingById(
                superAdminId,
            );
            //
            return {
                props: {
                    user: data.data,
                    // paymentSchedule,
                    controls: controls.data,
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
