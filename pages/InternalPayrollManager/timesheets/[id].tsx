import HidePage from '@components/bits-utils/HidePage';
import useWindowSize from '@components/generics/useWindowSize';
import { withPageAuth } from '@components/generics/withPageAuth';
import TimesheetPayrollManager from '@components/subpages/TimesheetPayrollManager';
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
}: {
    timeSheets: TimeSheetMonthlyView;
    id: string;
    payPeriod: any;
}) {
    //
    // const size: Size = useWindowSize();
    return (
        <>
            <TimesheetPayrollManager
                timeSheets={timeSheets}
                id={id}
                payPeriod={payPeriod}
            />
        </>
    );
}

export default SingleTimeSheet;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const { id } = ctx.query;
        const { end } = ctx.query;
        let { date } = ctx.query;
        if (date === undefined) {
            date = new Date();
        }

        date = moment(date).format('YYYY-MM-DD');

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
