import { VStack, Text } from '@chakra-ui/react';
import React from 'react';

export const NotText = ({ title, sub }) => {
    return (
        <VStack align="flex-start" mb="1.5rem">
            <Text color="#002861" fontSize="0.93rem" fontWeight="500" mb="0">
                {title}
            </Text>
            <Text color="#696969" fontSize="0.93rem" mb="0">
                {sub}
            </Text>
        </VStack>
    );
};
