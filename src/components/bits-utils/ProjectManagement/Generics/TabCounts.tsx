import { HStack, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

export const TabCounts = ({
    text,
    count,
    onClick,
    num,
    active,
}: {
    text: string;
    count: any;
    onClick: any;
    num: any;
    active?: any;
}) => {
    const formattedNumber = count?.toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false,
    });
    const router = useRouter();
    const isActive =
        router.query.status !== undefined ? router.query.status == num : active;
    return (
        <HStack
            onClick={onClick}
            cursor="pointer"
            bgColor={isActive ? '#2eafa3' : 'white'}
            borderBottom={isActive ? '3px solid #ffac00' : ''}
            p="1rem"
            borderRadius=".3rem .3rem 0 0"
            w="full"
        >
            <Text fontWeight={500} color={isActive ? 'white' : 'black'} mb="0">
                {text}
            </Text>
            <Text
                fontWeight={400}
                color={isActive ? 'white' : '#b6b6b6'}
                fontFamily="Roboto"
                mb="0"
            >
                ({formattedNumber})
            </Text>
        </HStack>
    );
};
