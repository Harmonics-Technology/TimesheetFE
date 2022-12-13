import { withPageAuth } from "@components/generics/withPageAuth";
import Timesheet from "@components/subpages/Timesheet";
import moment from "moment";
import { GetServerSideProps } from "next";
import React from "react";
import {
    TimeSheetMonthlyViewIEnumerableStandardResponse,
    TimeSheetService,
} from "src/services";

function SingleTimeSheet({
    timeSheets,
}: {
    timeSheets: TimeSheetMonthlyViewIEnumerableStandardResponse;
}) {
    return <Timesheet timeSheets={timeSheets} />;
}

export default SingleTimeSheet;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const { id } = ctx.query;
        const date = moment(new Date()).format("YYYY - MM - DD");
        console.log({ id });
        try {
            const data = await TimeSheetService.getTimeSheet(id, date);
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
