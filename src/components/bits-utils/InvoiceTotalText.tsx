import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

function InvoiceTotalText({
    label,
    value,
    cur,
    hst,
}: {
    label: string;
    value: string | number;
    cur: any;
    hst?: any;
}) {
    return (
        <Flex fontSize=".85rem" gap="1rem">
            <Text
                color="#212121"
                textTransform="uppercase"
                fontWeight="600"
                w="120px"
                textAlign="left"
            >
                {label} {hst && `(${hst}%)`}
            </Text>
            <Text color="#212121" fontWeight="400" w="115px" textAlign="left">
                {cur}
                {value}
            </Text>
        </Flex>
    );
}

export default InvoiceTotalText;
