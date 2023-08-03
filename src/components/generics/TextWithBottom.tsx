import { Box, Text } from '@chakra-ui/react';
import React from 'react';

export const TextWithBottom = ({
    title,
    text,
}: {
    title?: string;
    text?: any;
}) => {
    return (
        <Box>
            <Text color="#696969" fontSize=".875rem" mb=".3rem">
                {title}
            </Text>
            <Text fontSize=".875rem" color="#2d3748" fontWeight="500" mb="1em">
                {text}
            </Text>
        </Box>
    );
};
