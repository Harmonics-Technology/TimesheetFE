import { HStack, Circle, Text } from '@chakra-ui/react';
import React from 'react';

export const ChartLegend = ({ text, color }) => {
    return (
        <HStack spacing=".3rem">
            <Circle bgColor={color} size="8px" />
            <Text fontSize="11px" color="#8C8C8C">
                {text}
            </Text>
        </HStack>
    );
};
