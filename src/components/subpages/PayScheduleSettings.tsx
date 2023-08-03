import { Box } from '@chakra-ui/react';
import React from 'react';
import { BiPayScheduleSettings } from './BiPayScheduleSettings';
import { MonthPayScheduleSettings } from './MonthPayScheduleSettings';
import { WeeklyPaySchedule } from './WeeklyPayschedule';

export const PayScheduleSettings = () => {
    return (
        <Box bgColor="white" p="1.3rem" borderRadius="8px">
            <WeeklyPaySchedule />
            <BiPayScheduleSettings />
            <MonthPayScheduleSettings />
        </Box>
    );
};
