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
import React, { useContext, useEffect, useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import { Card, UserService } from 'src/services';
import { LicenseNav } from './ManageSub/LicenseNav';
import { EditBilling } from './ManageSub/EditBilling';
import { useRouter } from 'next/router';
import { BillingUpdateSubscription } from '@components/bits-utils/NewUpdates/BillingUpdateSubscription';

export const BillingInfo = ({
    data,
    countries,
}: {
    data: Card[];
    countries: any;
}) => {
    const { user, licenseData } = useContext(UserContext);
    const [loading, setLoading] = useState('');
    const [reactivateLoading, setReactivateLoading] = useState('');
    const toast = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setIsEditData] = useState();
    const [isExpired, setIsExpired] = useState(false);
    const router = useRouter();

    const getEditData = (data: any) => {
        setIsEditing((prev) => !prev);
        setIsEditData(data);
    };

    const expiredSub = licenseData?.filter(
        (x) => x?.subscriptionStatus == false,
    );

    const getClientSecret = async (id: string) => {
        setLoading(id);
        try {
            const res = await UserService.addNewCard(user?.id);
            if (res.status) {
                window.location.href = `${
                    process.env.NEXT_PUBLIC_TTS as string
                }/addcard/${res.data?.subscriptionId}?client_secret=${
                    res?.data?.clientSecret
                }&clientId=${res.data?.clientId}&from=${router.asPath}`;
                return;
            }
            toast({
                title: res.message,
                status: 'error',
            });
        } catch (err: any) {
            toast({
                title: err.body.message || err.message,
                status: 'error',
            });
        } finally {
            setLoading('');
        }
    };
    const reactivateSub = async (subId: string) => {
        setReactivateLoading(subId);
        try {
            const res = await UserService.resumeSubscription(user?.id, subId);
            if (res.status) {
                return;
            }
            toast({
                title: res.message,
                status: 'error',
            });
        } catch (err: any) {
            toast({
                title: err.body.message || err.message,
                status: 'error',
            });
        } finally {
            setReactivateLoading('');
        }
    };

    useEffect(() => {
        if (expiredSub?.length > 0) {
            setIsExpired(true);
        }
    }, []);

    return (
        <Box h={isExpired ? '75vh' : 'auto'} overflow="hidden">
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
            {isExpired && (
                <VStack gap="1rem" align="flex-start">
                    {expiredSub?.map((x) => (
                        <BillingUpdateSubscription
                            addCard={getClientSecret}
                            reactivateSub={reactivateSub}
                            expiredSub={x}
                            loading={loading}
                            reactivateLoading={reactivateLoading}
                        />
                    ))}
                </VStack>
            )}
            {isEditing ? (
                <EditBilling
                    data={editData}
                    setEditCard={setIsEditing}
                    countries={countries}
                />
            ) : (
                <Box pos="relative">
                    {isExpired && (
                        <Box
                            bgColor="rgb(206,207,213,.8)"
                            w="full"
                            h="full"
                            pos="absolute"
                            zIndex={999}
                            cursor="not-allowed"
                            borderRadius="5px"
                        />
                    )}
                    <Box
                        my="1rem"
                        borderRadius=".75rem"
                        bgColor="white"
                        p="1rem"
                    >
                        <HStack justify="space-between" gap="1rem" mb="1.77rem">
                            <Text fontWeight="500" color="#252f40">
                                Default Payment Method
                            </Text>
                        </HStack>

                        <Box w="60%">
                            {data.length > 0 ? (
                                <SavedCard
                                    data={
                                        data?.filter((x) => x.isDefaultCard)[0]
                                    }
                                    setIsEditing={getEditData}
                                />
                            ) : (
                                <Text textAlign="right" my="3rem">
                                    No Default Payment method has been added!
                                </Text>
                            )}
                        </Box>
                    </Box>
                    <Box
                        my="1rem"
                        borderRadius=".75rem"
                        bgColor="white"
                        p="1rem"
                    >
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
                                onClick={() => getClientSecret('add')}
                                isLoading={loading == 'add'}
                                spinner={<BeatLoader size={8} color="white" />}
                            >
                                Add new card
                            </Button>
                        </HStack>
                        <VStack w="60%" align="flex-start" spacing="2rem">
                            {data
                                ?.filter((x) => !x.isDefaultCard)
                                .map((x) => (
                                    <SavedCard
                                        data={x}
                                        isDefault
                                        key={x.id}
                                        setIsEditing={getEditData}
                                    />
                                ))}
                        </VStack>
                    </Box>
                </Box>
            )}
        </Box>
    );
};
