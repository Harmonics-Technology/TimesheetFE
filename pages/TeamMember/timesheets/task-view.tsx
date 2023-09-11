import { Box } from '@chakra-ui/react';
import { TabMenuTimesheet } from '@components/bits-utils/ProjectManagement/Generics/TabMenuTimesheet';
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

const task = ({ allShift, allProjects, id, superAdminId }) => {
    return (
        <Box bgColor="white" borderRadius=".6rem" p=".5rem">
            <TabMenuTimesheet name={['my-timesheet', 'task-view']} />
            <TeamTimeSheetTask
                allShift={allShift}
                allProjects={allProjects}
                id={id}
                superAdminId={superAdminId}
            />
        </Box>
    );
};

export default task;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const start = format(startOfMonth(new Date()), 'yyyy-MM-dd');
        const end = format(endOfMonth(new Date()), 'yyyy-MM-dd');
        const id = JSON.parse(ctx.req.cookies.user).id;
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;

        console.log({ id });
        try {
            const allShift =
                await ProjectManagementService.listUserProjectTimesheet(
                    id,
                    pagingOptions.from || start,
                    pagingOptions.to || end,
                );
            const allProjects = await ProjectManagementService.listProject(
                pagingOptions.offset,
                pagingOptions.limit || 50,
                superAdminId,
                pagingOptions.status,
                id,
                pagingOptions.search,
            );

            console.log({ allShift, allProjects });
            return {
                props: {
                    allShift,
                    allProjects,
                    id,
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
