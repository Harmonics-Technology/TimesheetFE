import { Box } from '@chakra-ui/react';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import ShiftManagement from '@components/subpages/ShiftManagement';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { GetServerSideProps } from 'next';
import React from 'react';
import { ShiftService, UserService } from 'src/services';

const schedule = ({ allShift, shiftUser, shiftTypes }) => {
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
                        text: 'Schedule',
                        url: '/shift-management/schedule',
                    },
                    {
                        text: 'Employee Shifts',
                        url: '/shift-management/employee-shifts',
                    },
                    {
                        text: 'Shift Approval',
                        url: '/shift-management/shift-approval',
                    },
                ]}
            />
            <ShiftManagement
                allShift={allShift}
                shiftUser={shiftUser}
                shiftTypes={shiftTypes}
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
        const superAdminId = JSON.parse(ctx.req.cookies.user).superAdminId;

        //
        try {
            const allShift = await ShiftService.listUsersShift(
                pagingOptions.from || start,
                pagingOptions.to || end,
                superAdminId,
            );
            const shiftUser = await UserService.listShiftUsers(
                pagingOptions.offset,
                pagingOptions.shiftLimit,
                superAdminId,
                pagingOptions.from || start,
                pagingOptions.to || end,
            );
            const shiftTypes = await ShiftService.listShiftTypes(superAdminId);
            return {
                props: {
                    allShift,
                    shiftUser,
                    shiftTypes,
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
