import {
    Box,
    Button,
    HStack,
    Link,
    Text,
    VStack,
    useToast,
} from '@chakra-ui/react';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import { SavedCard } from '@components/bits-utils/SavedCard';
import { UserContext } from '@components/context/UserContext';
import React, { useContext, useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import { Card, UserService } from 'src/services';
import { LicenseNav } from './ManageSub/LicenseNav';

export const BillingInfo = ({ data }: { data: Card[] }) => {
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const getClientSecret = async () => {
        setLoading(true);
        try {
            const res = await UserService.addNewCard(user?.id);
            if (res.status) {
                setLoading(false);

                window.location.href = `${
                    process.env.NEXT_PUBLIC_TTS as string
                }/addcard/${res.data?.subscriptionId}?client_secret=${
                    res?.data?.clientSecret
                }&clientId=${res.data?.clientId}`;
                return;
            }
            setLoading(false);
            toast({
                title: res.message,
                status: 'error',
            });
        } catch (err: any) {
            setLoading(false);
            toast({
                title: err.body.message || err.message,
                status: 'error',
            });
        }
    };
    return (
        <Box>
            {/* <LeaveTab
                tabValue={[
                    {
                        text: 'Subscription',
                        url: `/account-management/manage-subscription`,
                    },
                    {
                        text: 'Billing Information',
                        url: `/account-management/billing-information`,
                    },
                ]}
            /> */}
            <LicenseNav />
            <Box my="1rem" borderRadius=".75rem" bgColor="white" p="1rem">
                <HStack justify="space-between" gap="1rem" mb="1.77rem">
                    <Text fontWeight="500" color="#252f40">
                        Default Payment Method
                    </Text>
                </HStack>

                <Box w="60%">
                    {data.length > 0 ? (
                        <SavedCard
                            data={data?.filter((x) => x.isDefaultCard)[0]}
                        />
                    ) : (
                        <Text textAlign="right" my="3rem">
                            No Default Payment method has been added!
                        </Text>
                    )}
                </Box>
            </Box>
            <Box my="1rem" borderRadius=".75rem" bgColor="white" p="1rem">
                <HStack justify="space-between" gap="1rem" mb="1.77rem">
                    <Text fontWeight="500" color="#252f40">
                        Other Payment Method
                    </Text>

                    <Button
                        px="2rem"
                        color="white"
                        textTransform="uppercase"
                        borderRadius="0.375rem"
                        bgColor="brand.400"
                        h="2.5rem"
                        onClick={() => getClientSecret()}
                        isLoading={loading}
                        spinner={<BeatLoader size={8} color="white" />}
                    >
                        Add new card
                    </Button>
                </HStack>
                <VStack w="60%" align="flex-start" spacing="2rem">
                    {data
                        ?.filter((x) => !x.isDefaultCard)
                        .map((x) => (
                            <SavedCard data={x} isDefault key={x.id} />
                        ))}
                </VStack>
            </Box>
        </Box>
    );
};
