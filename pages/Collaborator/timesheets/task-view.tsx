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
import moment from 'moment';
import { GetServerSideProps } from 'next';
import React from 'react';
import {
    ProjectManagementService,
    ShiftService,
    UserService,
} from 'src/services';

const task = ({ allShift, allProjects, id, superAdminId, access }) => {
    return (
        <TeamTimeSheetTask
            allShift={allShift}
            allProjects={allProjects}
            id={id}
            superAdminId={superAdminId}
            access={access}
        />
    );
};

export default task;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const start = format(startOfMonth(new Date()), 'yyyy-MM-dd');
        const end = format(endOfMonth(new Date()), 'yyyy-MM-dd');
        const id = JSON.parse(ctx.req.cookies.user).id;
        const employeeId = JSON.parse(
            ctx.req.cookies.user,
        ).employeeInformationId;
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;

        try {
            const allShift =
                await ProjectManagementService.listUserProjectTimesheet(
                    employeeId,
                    pagingOptions.from || start,
                    pagingOptions.to || end,
                    pagingOptions.clientId,
                );
            const allProjects =
                await ProjectManagementService.listStrippedProject(
                    pagingOptions.offset,
                    50,
                    superAdminId,
                    pagingOptions.status,
                    id,
                    pagingOptions.search,
                );
            const access =
                await UserService.getSuperAdminProjectManagementSettings(
                    superAdminId,
                );
            return {
                props: {
                    allShift,
                    allProjects,
                    id,
                    superAdminId,
                    access: access.data,
                },
            };
        } catch (error: any) {
            console.log({ error });
            return {
                props: {
                    data: [],
                    team: [],
                },
            };
        }
    },
);
