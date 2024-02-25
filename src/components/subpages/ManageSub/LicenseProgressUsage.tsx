import { VStack, Text, HStack } from '@chakra-ui/react';
import { ProgressBar } from '@components/bits-utils/ProjectManagement/Generics/ProgressBar';
import React from 'react';

export const LicenseProgressUsage = ({
    fontSize,
    fontSizeb,
    title,
    cont,
    sub,
    progress,
}: {
    fontSize?: any;
    fontSizeb?: any;
    title?: any;
    cont?: any;
    sub?: any;
    progress: any;
}) => {
    return (
        <VStack align="flex-start">
            <HStack gap=".2rem" align="flex-end">
                <Text
                    fontSize={fontSize || '22px'}
                    color="#1b1d21"
                    fontWeight="500"
                    mb="0"
                    lineHeight="30px"
                >
                    {title}
                </Text>
                <Text
                    fontSize={fontSizeb || '22px'}
                    color="#1b1d21"
                    fontWeight="500"
                    mb="0"
                >
                    {cont}
                </Text>
            </HStack>
            <ProgressBar barWidth={progress} barColor={'brand.400'} />
            <Text fontSize={'12px'} color="#1b1d21" fontWeight="400" mb="0">
                {sub}
            </Text>
        </VStack>
    );
};
