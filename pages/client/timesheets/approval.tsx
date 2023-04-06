import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import TimesheetClient from '@components/subpages/TimesheetClientApproval';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    TimeSheetApprovedView,
    TimeSheetHistoryViewPagedCollectionStandardResponse,
    TimeSheetService,
} from 'src/services';

function approval({
    timeSheets,
}: {
    timeSheets: TimeSheetHistoryViewPagedCollectionStandardResponse;
}) {
    return <TimesheetClient timeSheets={timeSheets} />;
}

export default approval;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        try {
            const data =
                await TimeSheetService.getApprovedClientTeamMemberSheet(
                    pagingOptions.offset,
                    pagingOptions.limit,
                );
            console.log({ data });
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
