import { Flex, Text } from '@chakra-ui/react';
import React from 'react';

export const PayscheduleDayBox = ({
    text,
    fw = 400,
}: {
    text: string | number;
    fw?: any;
}) => {
    return (
        <Flex
            h="38px"
            align="center"
            px="13px"
            border="1px solid #f5f5f5"
            w="full"
        >
            <Text
                fontSize="12px"
                lineHeight="18px"
                color="#707683"
                fontWeight={fw}
                mb="0"
            >
                {text}
            </Text>
        </Flex>
    );
};
