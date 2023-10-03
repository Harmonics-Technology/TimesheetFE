import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import TeamTimesheetHistory from '@components/subpages/TeamTimesheetHistory';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    TimeSheetHistoryViewPagedCollectionStandardResponse,
    TimeSheetService,
} from 'src/services';

function all({
    timeSheets,
}: {
    timeSheets: TimeSheetHistoryViewPagedCollectionStandardResponse;
}) {
    return <TeamTimesheetHistory timeSheets={timeSheets} timesheet={true} />;
}

export default all;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const { id } = ctx.query;
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const data = await TimeSheetService.getTeamMemberRecentTimeSheet(
                pagingOptions.offset,
                pagingOptions.limit,
                id,
                pagingOptions.from,
                pagingOptions.to,
            );
            return {
                props: {
                    timeSheets: data,
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
