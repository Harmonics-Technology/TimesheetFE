import { withPageAuth } from '@components/generics/withPageAuth';
import { PayScheduleSettings } from '@components/subpages/PayScheduleSettings';
import { GetServerSideProps } from 'next';
import React from 'react';
import { FinancialService } from 'src/services';

const PaySchedule = ({ paymentSchedule }: { paymentSchedule: any }) => {
    return <PayScheduleSettings paymentSchedule={paymentSchedule} />;
};

export default PaySchedule;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const paymentSchedule = await FinancialService.getPaymentSchedules(
                superAdminId,
            );

            return {
                props: {
                    paymentSchedule: paymentSchedule.data,
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
