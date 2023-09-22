import { Box, HStack, Text } from '@chakra-ui/react';
import React from 'react';

export const ProgressBar = ({
    bg = '#e5e5e5',
    h = '0.3rem',
    barColor = '#F7E277',
    barWidth,
    showProgress = true,
    leftText,
    rightText,
}: {
    bg?: string;
    h?: string;
    barColor?: string;
    barWidth: number | undefined| null;
    showProgress?: boolean;
    leftText?: any;
    rightText?: any;
}) => {
    return (
        <Box w="full">
            {showProgress && (
                <HStack w="full" justify="space-between" mb="0.2rem">
                    <Text
                        fontSize=".65rem"
                        color="#8c8c8c"
                        fontWeight={500}
                        mb="0"
                    >
                        {leftText}
                    </Text>
                    <Text
                        fontSize=".65rem"
                        color="#8c8c8c"
                        fontWeight={500}
                        mb="0"
                    >
                        {rightText}
                    </Text>
                </HStack>
            )}
            <Box w="full" bgColor={bg} borderRadius="25px" h={h} pos="relative">
                <Box
                    w={`${barWidth}%`}
                    bgColor={barColor}
                    borderRadius="25px"
                    h="100%"
                    pos="absolute"
                    top="0"
                    left="0"
                />
            </Box>
        </Box>
    );
};
