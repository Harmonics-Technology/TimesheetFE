import Link from 'next/link';
import { Text } from '@chakra-ui/react';
import React from 'react';
import { useRouter } from 'next/router';

export const MiniTabs = ({ url, text }) => {
    const router = useRouter();
    return (
        <Link href={url} passHref>
            <Text
                bgColor={router.asPath == url ? 'gray.200' : 'transparent'}
                color={router.asPath == url ? 'brand.400' : 'gray.500'}
                mb="0"
                p=".5rem 1rem"
                cursor="pointer"
                fontWeight={router.asPath == url ? '600' : '400'}
            >
                {text}
            </Text>
        </Link>
    );
};
