import { Box, HStack, Text } from '@chakra-ui/react';
import React from 'react';

interface swapProps {
    userName: any;
    userShift: any;
    status?: any;
}

const ShiftSwapTemplate = ({ userName, userShift, status }: swapProps) => {
    return (
        <Box>
            <HStack align="flex-end" mb="1rem">
                <Text
                    fontSize="14px"
                    letterSpacing="0.01em"
                    color="#46464a"
                    mb="0"
                >
                    {userName}
                </Text>
                {status && (
                    <Text
                        fontSize="12px"
                        letterSpacing="0.01em"
                        fontWeight="700"
                        mb="0"
                        color={status == 'Accepted' ? 'brand.400' : '#c4c4c4'}
                    >
                        {status}
                    </Text>
                )}
            </HStack>
            <Text fontSize="14px" letterSpacing="0.01em" color="#46464a" mb="0">
                {userShift}
            </Text>
        </Box>
    );
};

export default ShiftSwapTemplate;
