import { Box } from '@chakra-ui/react';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import ShiftManagement from '@components/subpages/ShiftManagement';
import TeamShiftManagement from '@components/subpages/TeamShiftManagement';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { GetServerSideProps } from 'next';
import React from 'react';
import { ShiftService, UserService } from 'src/services';

const schedule = ({ allShift, shiftUser, id }) => {
    return (
        <Box
            bgColor="white"
            borderRadius="15px"
            padding="1.5rem"
            boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
        >
            <LeaveTab
                tabValue={[
                    {
                        text: 'My Shift',
                        url: '/shift-management/my-schedule',
                    },
                    {
                        text: 'Shift history',
                        url: '/shift-management/employee-shifts',
                    },
                    {
                        text: 'Team Schedule',
                        url: '/shift-management/schedule',
                    },
                    {
                        text: 'Shift Request',
                        url: '/shift-management/shift-request',
                    },
                ]}
            />
            <TeamShiftManagement
                allShift={allShift}
                id={id}
                shiftUser={shiftUser}
            />
        </Box>
    );
};

export default schedule;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const start = format(startOfWeek(new Date()), 'yyyy-MM-dd');
        const end = format(endOfWeek(new Date()), 'yyyy-MM-dd');
        const id = JSON.parse(ctx.req.cookies.user).id;
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;

        console.log({ id });
        try {
            const allShift = await ShiftService.listUsersShift(
                pagingOptions.from || start,
                pagingOptions.to || end,
                superAdminId,
                id,
                true,
            );
            const shiftUser = await UserService.listShiftUsers(
                pagingOptions.offset,
                pagingOptions.limit,
                superAdminId,
                pagingOptions.from || start,
                pagingOptions.to || end,
            );

            console.log({ allShift, shiftUser });
            return {
                props: {
                    allShift,
                    shiftUser,
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
