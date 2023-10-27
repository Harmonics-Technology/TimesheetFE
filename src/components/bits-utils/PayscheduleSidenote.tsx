import { VStack, Icon, Text, HStack, Box } from '@chakra-ui/react';
import React from 'react';
import { BsInfoSquareFill } from 'react-icons/bs';
import { PayscheduleDayBox } from './PayscheduleDayBox';

export const PayscheduleSidenote = () => {
    const SingleTable = ({
        day,
        sub,
        fw,
    }: {
        day: string;
        sub: string | number;
        fw?: any;
    }) => {
        return (
            <HStack gap="0">
                <PayscheduleDayBox text={day} fw={fw} />
                <PayscheduleDayBox text={sub} fw={fw} />
            </HStack>
        );
    };

    const days = [
        { day: 'Monday', count: 3 },
        { day: 'Tuesday', count: 4 },
        { day: 'Wednesday', count: 5 },
        { day: 'Thursday', count: 6 },
        { day: 'Friday', count: 7 },
    ];
    return (
        <VStack
            borderLeft="1px solid #C2CFE0"
            pl="27px"
            align="left"
            w="full"
            h="full"
            justify="center"
            gap="1rem"
        >
            <Icon as={BsInfoSquareFill} color="#073367" />
            <Text fontSize="12px" lineHeight="18px" color="#707683">
                if the ending period is a Friday, and you want the payment day
                to be Monday, Tuesday, Wednesday, Thursday, or Friday:
            </Text>
            <Box>
                <SingleTable
                    day="Desired Payment Day"
                    sub="Number of Days to Enter"
                    fw="500"
                />
                {days.map((x) => (
                    <SingleTable day={x.day} sub={x.count} />
                ))}
            </Box>

            <Text fontSize="12px" lineHeight="18px" color="#707683">
                In this table, you can see that to set the payment day to
                Monday, you would enter "3" days. For Tuesday, it's "4" days,
                and so on.
            </Text>
        </VStack>
    );
};
