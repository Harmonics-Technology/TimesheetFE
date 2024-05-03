import HidePage from '@components/bits-utils/HidePage';
import useWindowSize from '@components/generics/useWindowSize';
import { withPageAuth } from '@components/generics/withPageAuth';
// import Timesheet from "@components/subpages/Timesheet";
import TimesheetTeam from '@components/subpages/TimesheetTeam';
import { endOfMonth, startOfMonth } from 'date-fns';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    FinancialService,
    TimeSheetMonthlyView,
    TimeSheetService,
} from 'src/services';
interface Size {
    width: number | undefined;
    height: number | undefined;
}

function SingleTimeSheet({
    timeSheets,
    id,
    payPeriod,
    date,
    end,
}: {
    timeSheets: TimeSheetMonthlyView;
    id: string;
    payPeriod: any;
    date: any;
    end: any;
}) {
    const size: Size = useWindowSize();

    return (
        <>
            {/* {size.width != null && size.width <= 1025 ? (
                <HidePage />
            ) : ( */}
            <TimesheetTeam
                timeSheets={timeSheets}
                id={id}
                payPeriod={payPeriod}
                date={date}
                end={end}
            />
            {/* )} */}
        </>
    );
}

export default SingleTimeSheet;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const { id } = ctx.query;
        let { end } = ctx.query;
        let { date } = ctx.query;
        if (date === undefined || date === '') {
            date = new Date(startOfMonth(new Date()));
        }
        if (end === undefined || end === '') {
            end = new Date(endOfMonth(new Date()));
        }

        date = moment(date).format('YYYY-MM-DD');
        end = moment(end).format('YYYY-MM-DD');

        try {
            const data = await TimeSheetService.getTimeSheet(id, date, end);
            const payPeriod = await FinancialService.getPayScheduleInAMonth(
                id,
                date,
            );
            //
            return {
                props: {
                    timeSheets: data.data,
                    payPeriod: payPeriod.data,
                    id,
                    date,
                    end,
                },
            };
        } catch (error: any) {
            return {
                props: {
                    data: [],
                    payPeriod: [],
                },
            };
        }
    },
);
