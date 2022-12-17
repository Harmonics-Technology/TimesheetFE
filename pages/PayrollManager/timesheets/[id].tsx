import { withPageAuth } from '@components/generics/withPageAuth';
import TimesheetAdmin from '@components/subpages/TimesheetAdmin';
import moment from 'moment';
import { GetServerSideProps } from 'next';
import React from 'react';
import { TimeSheetMonthlyView, TimeSheetService } from 'src/services';

function SingleTimeSheet({ timeSheets }: { timeSheets: TimeSheetMonthlyView }) {
    return <TimesheetAdmin timeSheets={timeSheets} />;
}

export default SingleTimeSheet;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx: any) => {
        const { id } = ctx.query;
        const date = moment(new Date()).format('YYYY-MM-DD');
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
