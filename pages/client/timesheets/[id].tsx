import HidePage from '@components/bits-utils/HidePage';
import useWindowSize from '@components/generics/useWindowSize';
import { withPageAuth } from '@components/generics/withPageAuth';
import TimesheetAdmin from '@components/subpages/TimesheetAdmin';
import TimesheetSupervisor from '@components/subpages/TimesheetSupervisor';
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
    // console.log({ id });
    const size: Size = useWindowSize();
    return (
        <>
            {size.width != null && size.width <= 1245 ? (
                <HidePage />
            ) : (
                <TimesheetSupervisor timeSheets={timeSheets} id={id} />
            )}
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

        console.log({ id });
        try {
            const data = await TimeSheetService.getTimeSheet(id, date);
            console.log({ data });
            return {
                props: {
                    timeSheets: data.data,
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
