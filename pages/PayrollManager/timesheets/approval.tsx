import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import TimeSheetApproval from '@components/subpages/TimesheetApproval';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    AdminPaymentScheduleView,
    FinancialService,
    TimeSheetHistoryViewPagedCollectionStandardResponse,
    TimeSheetService,
} from 'src/services';

function approval({
    timeSheets,
    paymentSchedule,
}: {
    timeSheets: TimeSheetHistoryViewPagedCollectionStandardResponse;
    paymentSchedule: AdminPaymentScheduleView[];
}) {
    return <TimeSheetApproval timeSheets={timeSheets} paymentSchedule={paymentSchedule} />;
}

export default approval;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await TimeSheetService.listApprovedTimeSheet(
                pagingOptions.offset,
                pagingOptions.limit,
                superAdminId,
                pagingOptions.search,
            );
            const paymentSchedule = await FinancialService.getPaymentSchedules(
                superAdminId,
            );
            // console.log({ data: paymentSchedule.data });
            return {
                props: {
                    timeSheets: data,
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
