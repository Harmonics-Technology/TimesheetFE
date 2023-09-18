import { Button, Flex, Text, VStack } from '@chakra-ui/react';
import { UserContext } from '@components/context/UserContext';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';

export const PayScheduleNotify = ({ scheduleDone }: { scheduleDone: any }) => {
    const router = useRouter();
    const { user } = useContext(UserContext);
    const role = user?.role?.replaceAll(' ', '');
    return (
        <VStack h="60vh" justify="center" w="40%" mx="auto">
            <Text
                textAlign="center"
                fontSize="1.4rem"
                fontWeight={600}
                mb=".5rem !important"
            >
                Permission Denied!
            </Text>
            <Text textAlign="center">
                {role !== 'SuperAdmin'
                    ? 'Please contact your superadmin to gain access'
                    : ' You need to configure all payment schedules in your account management settings to view all records.'}
            </Text>
            <Text textAlign="center" fontWeight={500}>
                You currently have{' '}
                {scheduleDone.map((x) => x).join(', ') || 'no'} payment schedule
                configured{' '}
            </Text>
            {role == 'SuperAdmin' && (
                <Button
                    bgColor="brand.400"
                    color="white"
                    fontWeight="500"
                    borderRadius="4px"
                    fontSize=".875rem"
                    px="2rem"
                    mt="1.4rem !important"
                    onClick={() =>
                        router.push(
                            `/${role}/account-management/payment-schedule-settings`,
                        )
                    }
                >
                    Configure now
                </Button>
            )}
        </VStack>
    );
};
