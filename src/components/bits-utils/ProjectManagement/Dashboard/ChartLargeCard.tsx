import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

export const ChartLargeCard = ({ title, sub }) => {
    return (
        <Flex
            p="1.5rem 1.2rem"
            bgColor="white"
            borderRadius=".62rem"
            border=" 0.5px solid #C2CFE0"
            align="center"
            justify="flex-start"
        >
            <Box textAlign="left">
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
                <Box h="12rem"></Box>
            </Box>
        </Flex>
    );
};
