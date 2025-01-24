import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import React from 'react';
import { ShiftBtn } from '../ShiftBtn';

export const BillingUpdateSubscription = ({
    addCard,
    loading,
    reactivateSub,
    expiredSub,
    reactivateLoading,
}) => {
    return (
        <Box bgColor="white" borderRadius="10px" p="1rem" boxShadow="md">
            <VStack justify="space-between" gap=".5rem" align="flex-start">
                <Text fontWeight="600" color="#F5222D">
                    Subscription Inactive – Action Needed!
                </Text>
                <Text fontWeight="400" color="#67748E" fontSize=".9em">
                    It seems your <b>{expiredSub?.subscriptionType}</b>{' '}
                    subscription is currently inactive because our attempt to
                    charge your card was unsuccessful. You have{' '}
                    <b>
                        {expiredSub?.noOfLicenceUsed}{' '}
                        {expiredSub?.subscriptionType}
                    </b>{' '}
                    licenses assigned, but they are currently inactive. To
                    regain access, you can reactivate your subscription by
                    clicking the "Reactivate" button or updating your payment
                    details.
                </Text>
                <HStack gap="1rem" mt="1rem">
                    <ShiftBtn
                        text="Reactivate"
                        bg="brand.800"
                        color="white"
                        onClick={() =>
                            reactivateSub(expiredSub?.subscriptionId)
                        }
                        loading={
                            reactivateLoading == expiredSub?.subscriptionId
                        }
                    />
                    <ShiftBtn
                        text="Update card"
                        bg="brand.400"
                        color="white"
                        onClick={() => addCard(expiredSub?.subscriptionId)}
                        loading={loading == expiredSub?.subscriptionId}
                    />
                </HStack>
            </VStack>
        </Box>
    );
};
