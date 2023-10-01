import { Box, Flex, Text } from '@chakra-ui/react';
import LineChart from '@components/bits-utils/Charts/LineChart';
import React from 'react';

export const ChartLargeCard = ({ title, sub, children }) => {
    return (
        <Flex
            p="1.5rem 1.2rem"
            bgColor="white"
            borderRadius=".62rem"
            border=" 0.5px solid #C2CFE0"
            align="center"
            justify="flex-start"
        >
            <Box textAlign="left" w="full">
                <Text
                    fontSize="1.125rem"
                    fontWeight="600"
                    color="#2D3748"
                    mb="0"
                >
                    {title}
                </Text>
                <Text
                    fontSize=".875rem"
                    fontWeight="400"
                    color="#696969"
                    mb="0"
                >
                    {sub}
                </Text>
                <Box h="12rem" mt="1rem" w="full">
                    {children}
                </Box>
            </Box>
        </Flex>
    );
};
