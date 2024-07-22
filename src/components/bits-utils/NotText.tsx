import { VStack, Text } from '@chakra-ui/react';
import React from 'react';

export const NotText = ({
    title,
    fontWeight = '500',
    sub,
}: {
    title?: any;
    fontWeight?: any;
    sub?: any;
}) => {
    return (
        <VStack align="flex-start" mb="1rem">
            {title && (
                <Text
                    color="#002861"
                    fontSize="0.93rem"
                    fontWeight={fontWeight}
                    mb="0"
                >
                    {title}
                </Text>
            )}
            {sub && (
                <Text color="#696969" fontSize="0.93rem" mb="0">
                    {sub}
                </Text>
            )}
        </VStack>
    );
};
