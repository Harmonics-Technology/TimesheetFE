import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

function InvoiceTotalText({
    label,
    value,
    cur,
}: {
    label: string;
    value: string | number;
    cur: any;
}) {
    return (
        <Flex fontSize=".9rem">
            <Text
                color="gray.400"
                textTransform="uppercase"
                fontWeight="600"
                w="120px"
                textAlign="left"
            >
                {label}
            </Text>
            <Text color="black" fontWeight="600" w="120px" textAlign="right">
                {cur}
                {value}
            </Text>
        </Flex>
    );
}

export default InvoiceTotalText;
