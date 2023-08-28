import React from 'react';
import { HStack, Text } from '@chakra-ui/react';
import { ColoredTag } from './ColoredTag';

export const StatusBadge = ({ title, bg, text }) => {
    return (
        <HStack w="full" justify="space-between" mb="0.2rem">
            <Text color="#2d3748" fontSize=".75rem" fontWeight={500}>
                {title}
            </Text>
            <ColoredTag bg={bg} text={text} />
        </HStack>
    );
};
