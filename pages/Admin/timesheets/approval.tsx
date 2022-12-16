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

export const getServerSideProps: GetServerSideProps = withPageAuth(async () => {
    try {
        const data = await TimeSheetService.listTimeSheetHistories();
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
});
