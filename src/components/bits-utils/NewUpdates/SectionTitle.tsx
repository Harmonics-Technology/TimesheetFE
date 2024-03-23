import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

export const SectionTitle = ({ text }: { text: string }) => {
    return (
        <Flex
            justify="space-between"
            align="center"
            my="1rem"
            py="1rem"
            borderY="1px solid"
            borderColor="gray.300"
        >
            <Text
                textTransform="uppercase"
                mb="0"
                fontSize="1.3rem"
                fontWeight="500"
            >
                {text}
            </Text>
        </Flex>
    );
};
