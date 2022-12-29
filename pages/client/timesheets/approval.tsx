import { withPageAuth } from '@components/generics/withPageAuth';
import TimesheetClient from '@components/subpages/TimesheetClientApproval';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    TimeSheetApprovedView,
    TimeSheetHistoryViewPagedCollectionStandardResponse,
    TimeSheetService,
} from 'src/services';

function approval({ timeSheets }: { timeSheets: TimeSheetApprovedView[] }) {
    return <TimesheetClient timeSheets={timeSheets} />;
}

export default approval;

export const getServerSideProps: GetServerSideProps = withPageAuth(async () => {
    try {
        const data = await TimeSheetService.getApprovedClientTeamMemberSheet();
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
});
