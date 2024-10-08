import { Box } from '@chakra-ui/react';
import { TabMenuTimesheet } from '@components/bits-utils/ProjectManagement/Generics/TabMenuTimesheet';
import SupervisorTimesheetTask from '@components/bits-utils/SupervisorTimesheetTask';
import TeamTimeSheetTask from '@components/bits-utils/TeamTimeSheetTask';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import {
    format,
    startOfWeek,
    endOfWeek,
    endOfMonth,
    startOfMinute,
    startOfMonth,
} from 'date-fns';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ProjectManagementService,
    ShiftService,
    UserService,
} from 'src/services';

const task = ({ allShift, task, superAdminId }) => {
    return (
        <SupervisorTimesheetTask
            allShift={allShift}
            id={task}
            superAdminId={superAdminId}
        />
    );
};

export default task;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const start = format(startOfMonth(new Date()), 'yyyy-MM-dd');
        const end = format(endOfMonth(new Date()), 'yyyy-MM-dd');
        const { task } = ctx.query;
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;

        try {
            const allShift =
                await ProjectManagementService.listUserProjectTimesheet(
                    task,
                    pagingOptions.from || start,
                    pagingOptions.to || end,
                );
            return {
                props: {
                    allShift,
                    task,
                    superAdminId,
                },
            };
        } catch (error: any) {
            return {
                props: {
                    data: [],
                    team: [],
                },
            };
        }
    },
);
