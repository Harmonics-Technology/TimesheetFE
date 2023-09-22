import { Box, Text } from '@chakra-ui/react';
import React from 'react';

export const TextSub = ({ name, sub }) => {
    return (
        <Box>
            <Text color="#263238" fontSize=".81rem" fontWeight={500} mb="0">
                {name}
            </Text>
            <Text color="#696969" fontSize=".875em" fontWeight={500} mb="0">
                {sub}
            </Text>
        </Box>
    );
};
