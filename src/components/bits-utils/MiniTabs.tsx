import Link from 'next/link';
import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { useRouter } from 'next/router';

export const MiniTabs = ({ url, text }) => {
    const router = useRouter();
    return (
        <Link href={url} passHref>
            <Flex
                align="center"
                h="43px"
                bgColor={router.asPath == url ? 'brand.400' : 'transparent'}
                color={router.asPath == url ? 'white' : '#484747'}
            >
                <Text
                    mb="0"
                    p="0 1rem"
                    cursor="pointer"
                    fontWeight={router.asPath == url ? '700' : '500'}
                >
                    {text}
                </Text>
            </Flex>
        </Link>
    );
};
