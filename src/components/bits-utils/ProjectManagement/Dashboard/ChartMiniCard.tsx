import { Box, Flex, Text } from '@chakra-ui/react';
import DoughnutChart from '@components/bits-utils/Charts/DoughnutChart';
import moment from 'moment';
import React from 'react';

export const ChartMiniCard = ({ title, sub, children }) => {
    return (
        <Flex
            p="1.5rem 1.2rem"
            bgColor="white"
            borderRadius=".62rem"
            border=" 0.5px solid #C2CFE0"
            align="center"
            justify="center"
        >
            <Box textAlign="center">
                <Text fontSize=".87rem" fontWeight="600" color="#2D3748" mb="0">
                    {title}
                </Text>
                <Text fontSize=".75rem" fontWeight="400" color="#696969" mb="0">
                    Last 30 days{' '}
                    {`${moment()
                        .subtract(30, 'days')
                        .format('MMM DD')} - ${moment().format('MMM DD')}`}
                </Text>
                <Box h="12rem" mt="1rem">
                    {children}
                </Box>
            </Box>
        </Flex>
    );
};
