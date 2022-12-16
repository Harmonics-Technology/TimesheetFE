import { withPageAuth } from "@components/generics/withPageAuth";
// import Timesheet from "@components/subpages/Timesheet";
import TimesheetTeam from "@components/subpages/TimesheetClient";
import moment from "moment";
import { GetServerSideProps } from "next";
import React from "react";
import { TimeSheetMonthlyView, TimeSheetService } from "src/services";

function SingleTimeSheet({ timeSheets }: { timeSheets: TimeSheetMonthlyView }) {
    return <TimesheetTeam timeSheets={timeSheets} />;
}

export default SingleTimeSheet;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        console.log({
            ctx: JSON.parse(ctx.req.cookies.user).employeeInformationId,
        });
        const id = JSON.parse(ctx.req.cookies.user).employeeInformationId;
        const date = moment(new Date()).format("YYYY-MM-DD");
        console.log({ id });
        try {
            const data = await TimeSheetService.getTimeSheet(id, date);
            console.log({ data });
            return {
                props: {
                    timeSheets: data.data,
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
