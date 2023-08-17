import { Box } from '@chakra-ui/react';
import React from 'react';

export const LabelSign = ({ data = 'Configured!' }: { data?: any }) => {
    return (
        <Box
            bgColor={data == 'Configured!' ? 'gray.500' : 'red.500'}
            color="white"
            borderRadius="6px"
            h="1.8rem"
            display="flex"
            fontSize=".8rem"
            alignItems="center"
            px="1.5rem"
            w="fit-content"
        >
            {data}
        </Box>
    );
};
