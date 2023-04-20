import { Box } from '@chakra-ui/react';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { SwapShiftListTeam } from '@components/subpages/SwapShiftListTeam';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { GetServerSideProps } from 'next';
import React from 'react';
import { ShiftService, UserService } from 'src/services';

const ShiftApproval = ({ allShift }) => {
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
            <SwapShiftListTeam allShift={allShift} />
        </Box>
    );
};

export default ShiftApproval;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const start = format(startOfWeek(new Date()), 'yyyy-MM-dd');
        const end = format(endOfWeek(new Date()), 'yyyy-MM-dd');
        const id = JSON.parse(ctx.req.cookies.user).id;

        console.log({ start, end });
        try {
            const allShift = await ShiftService.getUserSwapShifts(
                pagingOptions.offset,
                pagingOptions.limit,
                id,
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
