import { Box } from '@chakra-ui/react';
import React from 'react';
import { BiPayScheduleSettings } from './BiPayScheduleSettings';
import { MonthPayScheduleSettings } from './MonthPayScheduleSettings';

export const PayScheduleSettings = () => {
    return (
        <Box bgColor="white" p="1.3rem" borderRadius="8px">
            <BiPayScheduleSettings />
            <MonthPayScheduleSettings />
        </Box>
    );
};
