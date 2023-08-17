import { Box } from '@chakra-ui/react';
import React from 'react';
import { BiPayScheduleSettings } from './BiPayScheduleSettings';
import { MonthPayScheduleSettings } from './MonthPayScheduleSettings';
import { WeeklyPaySchedule } from './WeeklyPayschedule';

export const PayScheduleSettings = ({
    paymentSchedule,
}: {
    paymentSchedule: any;
}) => {
    const isWeekly = paymentSchedule?.find((x) => x.scheduleType == 'Weekly');
    const isBiWeekly = paymentSchedule?.find(
        (x) => x.scheduleType == 'Bi-Weekly',
    );
    const isMonthly = paymentSchedule?.find((x) => x.scheduleType == 'Monthly');
    return (
        <Box bgColor="white" p="1.3rem" borderRadius="8px">
            <WeeklyPaySchedule data={isWeekly} />
            <BiPayScheduleSettings data={isBiWeekly} />
            <MonthPayScheduleSettings data={isMonthly} />
        </Box>
    );
};
