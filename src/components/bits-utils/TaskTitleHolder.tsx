import { Text, VStack } from '@chakra-ui/react';
import React from 'react';

const TaskTitleHolder = ({
    title,
    sub,
    color = '#1b1d21',
}: {
    title: string;
    sub?: string;
    color?: any;
}) => {
    return (
        <VStack gap=".8rem" align="flex-start">
            <Text fontSize=".875rem" color={color} fontWeight={500}>
                {title}
            </Text>
            <Text fontSize=".8125rem" color="#263238" fontWeight={400}>
                {sub}
            </Text>
        </VStack>
    );
};

export default TaskTitleHolder;
