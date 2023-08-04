import { Box, Button, Image, Text, VStack } from '@chakra-ui/react';
import { UserContext } from '@components/context/UserContext';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';

export const InactiveUser = () => {
    const router = useRouter();
    const { user } = useContext(UserContext);
    const role = user?.role?.replaceAll(' ', '');
    return (
        <Box w="100%" mx="auto" bgColor="white" p="4rem">
            <VStack spacing="2rem">
                <Box w="20%">
                    <Image
                        src="/assets/dash.png"
                        alt="inactive subscription"
                        w="full"
                    />
                </Box>
                <VStack>
                    <Text
                        fontSize="3rem"
                        fontWeight="600"
                        textAlign="center"
                        mb="0"
                    >
                        No data available!
                    </Text>
                    <Text
                        fontSize="1rem"
                        fontWeight="400"
                        textAlign="center"
                        w="60%"
                    >
                        Hi there! there is currently no data to show you. This
                        may happen due to an inactive subscription or due
                        invoice. Kindly reactivate your subscription to resume
                        using TIMBA.
                    </Text>
                </VStack>
                <Button
                    borderRadius="55px"
                    bgColor="brand.400"
                    color="white"
                    px="3rem"
                    h="4rem"
                    onClick={() =>
                        router.push(
                            role == 'SuperAdmin'
                                ? `/${role}/account-management/manage-subscription`
                                : `/${role}/dashboard`,
                        )
                    }
                >
                    Manage Subscription
                </Button>
            </VStack>
        </Box>
    );
};
