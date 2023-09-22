import { Box } from '@chakra-ui/react';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { EmployeeShift } from '@components/subpages/EmployeeShift';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { GetServerSideProps } from 'next';
import React from 'react';
import { ShiftService, UserService } from 'src/services';

const schedule = ({ allShift, getUserInfo }) => {
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
            <EmployeeShift allShift={allShift} />
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

        try {
            const allShift = await ShiftService.getUsersShift(
                pagingOptions.offset,
                pagingOptions.limit,
                pagingOptions.from || start,
                pagingOptions.to || end,
                superAdminId,
            );

            return {
                props: {
                    allShift,
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
