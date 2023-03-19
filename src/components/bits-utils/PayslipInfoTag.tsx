import { HStack, Text } from '@chakra-ui/react';
import React from 'react';

export const PayslipInfoTag = ({ title, value }) => {
    return (
        <HStack>
            <Text
                minW="200px"
                fontWeight="700"
                textTransform="uppercase"
                mb="0"
            >
                {title}:
            </Text>
            <Text mb="0" noOfLines={1}>
                {value}
            </Text>
        </HStack>
    );
};
