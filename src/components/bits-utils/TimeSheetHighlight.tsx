import { Box, HStack, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { BsInfoCircleFill } from 'react-icons/bs';

export const TimeSheetHighlight = () => {
    return (
        <Box pos="fixed" top="10%" left="50%" transform="translateX(-30%)" zIndex='800'>
            <HStack
                color="#2E5268"
                border="1px solid #2EAFA3"
                bgColor="rgba(79, 209, 197, 0.13)"
                px="1rem"
                h="2.4rem"
            >
                <Icon as={BsInfoCircleFill} />
                <Text mb="0" fontSize=".8rem">
                    The highlighted weeks is the pay period for this month
                </Text>
            </HStack>
        </Box>
    );
};
