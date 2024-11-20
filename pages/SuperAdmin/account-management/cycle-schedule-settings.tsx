import { withPageAuth } from '@components/generics/withPageAuth';
import { PayScheduleSettings } from '@components/subpages/PayScheduleSettings';
import { GetServerSideProps } from 'next';
import React from 'react';
import { FinancialService, UserService } from 'src/services';

const PaySchedule = ({
    paymentSchedule,
    data,
}: {
    paymentSchedule: any;
    data: any;
}) => {
    return (
        <PayScheduleSettings paymentSchedule={paymentSchedule} data={data} />
    );
};

export default PaySchedule;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const paymentSchedule = await FinancialService.getPaymentSchedules(
                superAdminId,
            );
            const data = await UserService.getControlSettingById(superAdminId);
            return {
                props: {
                    paymentSchedule: paymentSchedule.data,
                    data: data.data,
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
