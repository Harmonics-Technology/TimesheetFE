import { HStack, Text } from '@chakra-ui/react';
import React from 'react';

export const TabCounts = ({
    text,
    count,
    onClick,
}: {
    text: string;
    count: any;
    onClick: any;
}) => {
    const formattedNumber = count.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false,
    });
    return (
        <HStack onClick={onClick} cursor="pointer">
            <Text fontWeight={500} color="black" mb="0">
                {text}
            </Text>
            <Text fontWeight={400} color="#b6b6b6" fontFamily="Roboto" mb="0">
                ({formattedNumber})
            </Text>
        </HStack>
    );
};
