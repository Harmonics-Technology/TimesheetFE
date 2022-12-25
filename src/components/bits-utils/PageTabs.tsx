import { Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

function PageTabs({ url, tabName }: { url: string; tabName: string }) {
    const router = useRouter();
    const isActive = router.pathname == url;
    return (
        <Flex
            justify="center"
            align="center"
            w="full"
            h="4rem"
            bgColor={isActive ? 'white' : 'brand.100'}
            onClick={() => router.push(url)}
            color={isActive ? 'brand.400' : 'gray.500'}
            // borderRadius="8px"
            cursor="pointer"
            fontWeight="bold"
            borderX="1px solid"
            borderBottom={isActive ? 'none' : '1px solid'}
            borderTop={isActive ? '1px solid' : 'none'}
            borderColor="gray.200"
            // mb="1rem"
        >
            {tabName}
        </Flex>
    );
}

export default PageTabs;
