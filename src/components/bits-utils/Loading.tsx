import { Flex, Spinner } from '@chakra-ui/react';
import React from 'react';

function Loading({ loading }: { loading: boolean }) {
    return (
        <Flex
            pos="absolute"
            w="100%"
            h="full"
            bgColor="rgb(206,207,213,.8)"
            justify="center"
            align="center"
            left="0"
            top="0"
            zIndex="988"
            pointerEvents="none"
            display={loading ? 'flex' : 'none'}
        >
            <Spinner size="xl" color="black" />
        </Flex>
    );
}

export default Loading;
