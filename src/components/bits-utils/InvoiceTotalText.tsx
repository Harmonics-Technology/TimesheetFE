import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

function InvoiceTotalText({
    label,
    value,
}: {
    label: string;
    value: string | number;
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
            <Text color="black" fontWeight="600">
                $ {value}
            </Text>
        </Flex>
    );
}

export default InvoiceTotalText;
