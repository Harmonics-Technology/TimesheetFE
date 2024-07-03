import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    Flex,
    ModalBody,
    Box,
    Text,
    HStack,
    Button,
    VStack,
    useToast,
} from '@chakra-ui/react';
import { UserContext } from '@components/context/UserContext';
import { TextWithBottom } from '@components/generics/TextWithBottom';
import { CAD } from '@components/generics/functions/Naira';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import BeatLoader from 'react-spinners/BeatLoader';
import { PrimaryRadio } from './PrimaryRadio';
import axios from 'axios';
import getSubBalance from '@components/generics/functions/getSubBalance';
import { useRouter } from 'next/router';
import { UpdateClientStripeSubscriptionModel, UserService } from 'src/services';

export const UpgradeSubModal = ({ isOpen, onClose }: any) => {
    const { user, subDetails } = useContext(UserContext);
    const subType = subDetails?.data;
    const [allSubs, setAllSubs] = useState<any>([]);
    const [subData, setSubData] = useState<any>([]);
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors, isSubmitting },
    } = useForm<UpdateClientStripeSubscriptionModel>({
        mode: 'all',
    });
    const selected = Number(watch('subscriptionId')?.split('$')[1].trim());
    const balanceUnused = getSubBalance(subType, selected);
    //
    //
    const toast = useToast();
    const router = useRouter();
    const selectedSub = allSubs.find(
        (x) => x.name == watch('subscriptionId')?.split('$')[0].trim(),
    );

    const onSubmit = async (data: UpdateClientStripeSubscriptionModel) => {
        data.subscriptionId = selectedSub?.id;
        data.totalAmount = balanceUnused;
        data.userId = user?.id;

        try {
            const result = await UserService.upgradeSubscription(data);
            if (result.status) {
                toast({
                    title: `Upgrade Requested`,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.replace(router.asPath);
                onClose();
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            return;
        } catch (err: any) {
            toast({
                title: err.body.message || err.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    useEffect(() => {
        const getSubs = async () => {
            try {
                setLoading(true);
                const res = await axios.get(
                    'https://pi-commandcenterdev.azurewebsites.net/api/Subscription/subscriptions',
                );
                if (res.status) {
                    setLoading(false);
                    setAllSubs(res.data.data);
                    setSubData(
                        res.data.data
                            ?.filter((x) => x.id !== subType?.subscription?.id)
                            ?.map(
                                (obj) =>
                                    `${obj.name} ${CAD(
                                        obj.monthlyAmount as number,
                                    )}`,
                            ),
                    );
                    return;
                }
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        getSubs();
    }, []);
    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                motionPreset="slideInBottom"
                isCentered
                trapFocus={false}
            >
                <ModalOverlay
                    bg="blackAlpha.300"
                    backdropFilter="blur(10px) "
                />

                <ModalContent
                    py={5}
                    borderRadius="0px"
                    w={['88%', '60%']}
                    // overflow="hidden"
                    maxH="100vh"
                    pos="fixed"
                    mt="1rem"
                    mb="1rem"
                    maxW="100%"
                >
                    <ModalHeader textAlign="center">
                        <Flex justify="center">
                            <Text
                                color="black"
                                fontSize="20px"
                                textAlign="center"
                                fontWeight="bold"
                            >
                                Upgrade Subscription
                            </Text>
                            {/* <Icon as={GrClose} onClick={onClose} cursor="pointer" /> */}
                        </Flex>
                    </ModalHeader>

                    <ModalBody>
                        <Box minH="65vh" overflowY="auto" w="80%" mx="auto">
                            <VStack spacing="2rem" w="full" mb="4rem">
                                <Box
                                    border="1px solid #A6ACBE"
                                    borderRadius="0.43rem"
                                    p="1rem"
                                    w="full"
                                >
                                    <TextWithBottom
                                        title="Current Subscription Plan"
                                        text={`${subType?.subscription?.name} Package`}
                                    />
                                    <TextWithBottom
                                        title="Amount/Price"
                                        text={`${CAD(subType?.totalAmount)} `}
                                    />
                                </Box>
                                <Box
                                    border="1px solid #A6ACBE"
                                    borderRadius="0.43rem"
                                    p="1rem"
                                    w="full"
                                    pos="relative"
                                >
                                    {loading ? (
                                        <Flex justify="center">
                                            <BeatLoader
                                                size={10}
                                                color="#2EAFA3"
                                            />
                                        </Flex>
                                    ) : (
                                        <Box>
                                            <TextWithBottom title="Select the plan you want to Upgrade your monthly Subscription to?" />
                                            <PrimaryRadio<UpdateClientStripeSubscriptionModel>
                                                radios={subData}
                                                name="subscriptionId"
                                                control={control}
                                                gap="1rem"
                                                error={errors.subscriptionId}
                                                flexDir="column"
                                            />

                                            <Box
                                                mt="2rem"
                                                right="3%"
                                                bottom="0"
                                                pos="absolute"
                                            >
                                                <TextWithBottom
                                                    title="Amount Due"
                                                    text={`${CAD(
                                                        balanceUnused || 0,
                                                    )} `}
                                                />
                                            </Box>
                                        </Box>
                                    )}
                                </Box>
                            </VStack>
                            <HStack spacing="0" gap="2rem">
                                <Button
                                    w="full"
                                    bgColor="#DA586F"
                                    color="white"
                                    border="5px"
                                    fontSize="14px"
                                    borderRadius="5px"
                                    h="3rem"
                                    onClick={onClose}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    w="full"
                                    bgColor="brand.400"
                                    color="white"
                                    border="5px"
                                    fontSize="14px"
                                    borderRadius="5px"
                                    h="3rem"
                                    // isDisabled={!isValid}
                                    isLoading={isSubmitting}
                                    onClick={handleSubmit(onSubmit)}
                                >
                                    Upgrade
                                </Button>
                            </HStack>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
