import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

export const SectionTitle = ({
    text,
    sub,
}: {
    text?: string;
    sub?: JSX.Element;
}) => {
    return (
        <Flex
            justify="space-between"
            align="center"
            my="1rem"
            py="1rem"
            borderY="1px solid"
            borderColor="gray.300"
            gap=".5rem"
        >
            {text && (
                <Text
                    textTransform="uppercase"
                    mb="0"
                    fontSize="1.3rem"
                    fontWeight="500"
                    whiteSpace="nowrap"
                >
                    {text}
                </Text>
            )}
            {sub && sub}
        </Flex>
    );
};
