import { Box, HStack, Text } from '@chakra-ui/react';
import React from 'react';

export const TextWithBottom = ({
    title,
    text,
    sub,
}: {
    title?: string;
    text?: any;
    sub?: any;
}) => {
    return (
        <Box>
            <Text color="#696969" fontSize=".875rem" mb=".3rem">
                {title}
            </Text>
            <HStack>
                <Text
                    fontSize=".875rem"
                    color="#2d3748"
                    fontWeight="500"
                    mb="1em"
                >
                    {text}
                </Text>
                <Text
                    fontSize=".875rem"
                    color={
                        sub == 'Expired'
                            ? 'red'
                            : sub == 'Active'
                            ? 'brand.400'
                            : '@2d3748'
                    }
                    fontWeight="500"
                    mb="1em"
                >
                    {sub}
                </Text>
            </HStack>
        </Box>
    );
};
