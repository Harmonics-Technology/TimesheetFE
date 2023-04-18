import { Box } from '@chakra-ui/react';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import { filterPagingSearchOptions } from '@components/generics/filterPagingSearchOptions';
import { withPageAuth } from '@components/generics/withPageAuth';
import { ShiftSwapList } from '@components/subpages/ShiftSwapList';
import { SwapShiftList } from '@components/subpages/SwapShiftsList';
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
            <SwapShiftList allShift={allShift} />
        </Box>
    );
};

export default ShiftApproval;

export const getServerSideProps: GetServerSideProps = withPageAuth(
    async (ctx) => {
        const pagingOptions = filterPagingSearchOptions(ctx);
        const start = format(startOfWeek(new Date()), 'yyyy-MM-dd');
        const end = format(endOfWeek(new Date()), 'yyyy-MM-dd');
        const { id } = ctx.query;

        console.log({ start, end });
        try {
            const allShift = await ShiftService.getAllSwapShifts(
                pagingOptions.offset,
                pagingOptions.limit,
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
