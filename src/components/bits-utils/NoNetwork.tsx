import { Button, Text, VStack, Image } from '@chakra-ui/react';
import React from 'react';
import { useRouter } from 'next/router';

export const NoNetwork = () => {
    const router = useRouter();
    return (
        <VStack gap="1rem" h="100vh" justify="center" align="center">
            <Image src="/assets/newlogob.png" h="2rem" />
            <Text>It looks like you're not connected to the internet!</Text>
            <Button onClick={() => router.reload()}>Refresh</Button>
        </VStack>
    );
};
