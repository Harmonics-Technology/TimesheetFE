import { withPageAuth } from "@components/generics/withPageAuth";
import TeamTimesheetHistory from "@components/subpages/TeamTimesheetHistory";
import { GetServerSideProps } from "next";
import React from "react";
import {
    TimeSheetHistoryViewPagedCollectionStandardResponse,
    TimeSheetService,
} from "src/services";

function history({
    timeSheets,
}: {
    timeSheets: TimeSheetHistoryViewPagedCollectionStandardResponse;
}) {
    return <TeamTimesheetHistory timeSheets={timeSheets} />;
}

export default history;

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
