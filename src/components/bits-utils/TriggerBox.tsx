import { Box } from '@chakra-ui/react';
import React from 'react';

export const TriggerBox = ({ opens }) => {
    return (
        <Box
            w="full"
            h="full"
            pos="absolute"
            bgColor="transparent"
            top="0"
            onClick={opens}
        />
    );
};
