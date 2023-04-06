import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import TimesheetClient from '@components/subpages/TimesheetClientHistory';
import TimesheetHistory from '@components/subpages/TimesheetHistory';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    TimeSheetHistoryView,
    TimeSheetHistoryViewPagedCollectionStandardResponse,
    TimeSheetService,
} from 'src/services';

function history({
    timeSheets,
}: {
    timeSheets: TimeSheetHistoryViewPagedCollectionStandardResponse;
}) {
    return <TimesheetClient timeSheets={timeSheets} />;
}

export default history;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const data = await TimeSheetService.getClientTimeSheetHistory(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.search,
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
