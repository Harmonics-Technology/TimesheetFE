import { filterPagingSearchOptions } from "@components/generics/filterPagingSearchOptions";
import { withPageAuth } from "@components/generics/withPageAuth";
import TimeSheetApproval from "@components/subpages/TimesheetApproval";
import { GetServerSideProps } from "next";
import React from "react";
import {
    TimeSheetHistoryViewPagedCollectionStandardResponse,
    TimeSheetService,
} from "src/services";

function approval({
    timeSheets,
}: {
    timeSheets: TimeSheetHistoryViewPagedCollectionStandardResponse;
}) {
    return <TimeSheetApproval timeSheets={timeSheets} />;
}

export default approval;

export const getServerSideProps: GetServerSideProps = withPageAuth(async (ctx) => {
    const pagingOptions = filterPagingSearchOptions(ctx);
    try {
        const data = await TimeSheetService.listApprovedTimeSheet(
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
        (error);
        return {
            props: {
                data: [],
            },
        };
    }
});
