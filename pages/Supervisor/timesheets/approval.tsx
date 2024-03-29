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
    return (
        <TimeSheetApproval
            timeSheets={timeSheets}
            paymentSchedule={paymentSchedule}
        />
    );
}

export default approval;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;
        try {
            const data = await TimeSheetService.getSuperviseesApprovedTimeSheet(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
                pagingOptions.from,
                pagingOptions.to,
            );
            const paymentSchedule = await FinancialService.getPaymentSchedules(
                superAdminId,
            );
            return {
                props: {
                    timeSheets: data,
                    paymentSchedule: paymentSchedule.data,
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
