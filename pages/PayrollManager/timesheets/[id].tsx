import HidePage from '@components/bits-utils/HidePage';
import useWindowSize from '@components/generics/useWindowSize';
import { withPageAuth } from '@components/generics/withPageAuth';
import TimesheetAdmin from '@components/subpages/TimesheetAdmin';
import TimesheetPayrollManager from '@components/subpages/TimesheetPayrollManager';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import React from 'react';
import { TimeSheetMonthlyView, TimeSheetService } from 'src/services';
interface Size {
    width: number | undefined;
    height: number | undefined;
}

function SingleTimeSheet({
    timeSheets,
    id,
}: {
    timeSheets: TimeSheetMonthlyView;
    id: string;
}) {
    // ({ id });
    // const size: Size = useWindowSize();
    return (
        <>
            <TimesheetPayrollManager timeSheets={timeSheets} id={id} />
        </>
    );
}

export default SingleTimeSheet;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const { id } = ctx.query;

        let { date } = ctx.query;
        if (date === undefined) {
            date = moment(new Date()).format('YYYY-MM-DD');
        }

        ({ id });
        try {
            const data = await TimeSheetService.getTimeSheet(id, date);
            ({ data });
            return {
                props: {
                    timeSheets: data.data,
                    id,
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
    },
);
