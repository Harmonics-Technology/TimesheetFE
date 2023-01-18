import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import TeamTimesheetHistory from '@components/subpages/TeamTimesheetHistory';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    TimeSheetHistoryViewPagedCollectionStandardResponse,
    TimeSheetService,
} from 'src/services';

function history({
    timeSheets,
}: {
    timeSheets: TimeSheetHistoryViewPagedCollectionStandardResponse;
}) {
    return <TeamTimesheetHistory timeSheets={timeSheets} />;
}

export default history;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const id = JSON.parse(ctx.req.cookies.user).employeeInformationId;
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const data = await TimeSheetService.getTeamMemberRecentTimeSheet(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.date,
            );
            return {
                props: {
                    timeSheets: data,
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
