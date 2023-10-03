import { Box } from '@chakra-ui/react';
import React from 'react';
import { BiPayScheduleSettings } from './BiPayScheduleSettings';
import { MonthPayScheduleSettings } from './MonthPayScheduleSettings';
import { WeeklyPaySchedule } from './WeeklyPayschedule';
import { ControlSettingView } from 'src/services';

export const PayScheduleSettings = ({
    paymentSchedule,
    data,
}: {
    paymentSchedule: any;
    data: ControlSettingView;
}) => {
    const isWeekly = paymentSchedule?.find((x) => x.scheduleType == 'Weekly');
    const isBiWeekly = paymentSchedule?.find(
        (x) => x.scheduleType == 'Bi-Weekly',
    );
    const isMonthly = paymentSchedule?.find((x) => x.scheduleType == 'Monthly');
    return (
        <Box bgColor="white" p="1.3rem" borderRadius="8px">
            <WeeklyPaySchedule
                data={isWeekly}
                bPeriod={data?.weeklyBeginingPeriodDate}
                payday={data?.weeklyPaymentPeriod}
            />
            <BiPayScheduleSettings
                data={isBiWeekly}
                bPeriod={data?.biWeeklyBeginingPeriodDate}
                payday={data?.biWeeklyPaymentPeriod}
            />
            <MonthPayScheduleSettings
                data={isMonthly}
                bPeriod={data?.montlyBeginingPeriodDate}
                payday={data?.monthlyPaymentPeriod}
                isMonth={data?.isMonthlyPayScheduleFullMonth}
            />
        </Box>
    );
};
