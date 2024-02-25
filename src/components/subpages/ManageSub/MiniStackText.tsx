import { Box, HStack, Text } from '@chakra-ui/react';
import React from 'react';

export const MiniStackText = ({ title, value }: { title: any; value: any }) => {
    return (
        <HStack w="full">
            <Box w="30%">
                <Text color="#696969" fontSize="14px">
                    {title}
                </Text>
            </Box>
            <Box w="70%">
                <Text color="#696969" fontSize="14px">
                    {value}
                </Text>
            </Box>
        </HStack>
    );
};
