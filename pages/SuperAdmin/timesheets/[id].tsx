import HidePage from '@components/bits-utils/HidePage';
import useWindowSize from '@components/generics/useWindowSize';
import { withPageAuth } from '@components/generics/withPageAuth';
import TimesheetAdmin from '@components/subpages/TimesheetAdmin';
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
    // console.log({ id });
    // const size: Size = useWindowSize();
    return (
        <>
            <TimesheetAdmin
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
            date = moment(new Date()).format('YYYY-MM-DD');
        }

        console.log({ id, date });
        try {
            const data = await TimeSheetService.getTimeSheet(id, date, end);
            const payPeriod = await FinancialService.getPayScheduleInAMonth(
                id,
                date,
            );
            console.log({ payPeriod: payPeriod.data });
            return {
                props: {
                    timeSheets: data.data,
                    payPeriod: payPeriod.data,
                    id,
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
