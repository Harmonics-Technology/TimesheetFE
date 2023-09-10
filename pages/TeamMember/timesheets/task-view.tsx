import { Box } from '@chakra-ui/react';
import { TabMenuTimesheet } from '@components/bits-utils/ProjectManagement/Generics/TabMenuTimesheet';
import TeamTimeSheetTask from '@components/bits-utils/TeamTimeSheetTask';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ProjectManagementService,
    ShiftService,
    UserService,
} from 'src/services';

const task = ({ allShift, allProjects, id }) => {
    return (
        <Box bgColor="white" borderRadius=".6rem" p=".5rem">
            <TabMenuTimesheet name={['my-timesheet', 'task-view']} />
            <TeamTimeSheetTask
                allShift={allShift}
                allProjects={allProjects}
                id={id}
            />
        </Box>
    );
};

export default task;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const start = format(startOfWeek(new Date()), 'yyyy-MM-dd');
        const end = format(endOfWeek(new Date()), 'yyyy-MM-dd');
        const id = JSON.parse(ctx.req.cookies.user).id;
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;

        console.log({ id });
        try {
            const allShift =
                await ProjectManagementService.listUserProjectTimesheet(
                    id,
                    pagingOptions.from || start,
                );
            const allProjects = await ProjectManagementService.getUserTasks(
                pagingOptions.offset,
                pagingOptions.limit || 50,
                id,
            );

            console.log({ allShift, allProjects });
            return {
                props: {
                    allShift,
                    allProjects,
                    id,
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
