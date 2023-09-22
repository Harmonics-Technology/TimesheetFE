import { Flex } from '@chakra-ui/react';
import React from 'react';

export const ColoredTag = ({
    bg,
    text,
    h,
}: {
    bg: string;
    text: string;
    h?: any;
}) => {
    return (
        <Flex
            borderRadius=".3rem"
            bgColor={bg}
            color="white"
            h={`${h || 1.2}rem`}
            px={`${h || 0 + 0.5}rem`}
            fontSize=".5rem"
            fontWeight={500}
            align="center"
        >
            {text}
        </Flex>
    );
};
