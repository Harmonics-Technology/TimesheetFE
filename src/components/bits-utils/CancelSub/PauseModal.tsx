import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    Flex,
    ModalBody,
    Box,
    HStack,
    Text,
    Button,
    Icon,
    useToast,
} from '@chakra-ui/react';
import React, { useContext } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
import { PrimaryRadio } from '../PrimaryRadio';
import { GrClose } from 'react-icons/gr';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { UserService } from 'src/services';
import { UserContext } from '@components/context/UserContext';

interface PauseModel {
    duration?: string | undefined | null;
}

export const PauseModal = ({ isOpen, onClose }) => {
    const { user } = useContext(UserContext);
    const currentSub: any = user?.subscriptiobDetails?.data;
    const {
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<PauseModel>({
        mode: 'all',
    });
    const router = useRouter();
    const toast = useToast();
    const onSubmit = async (data: PauseModel) => {
        data.duration = data.duration?.split(' ')[0];
        try {
            const result = await UserService.pauseSubscription(
                currentSub?.id,
                Number(data.duration as unknown as number),
            );
            if (result.status) {
                toast({
                    title: `Your pause request has been recieved`,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.reload();
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
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            motionPreset="slideInBottom"
            isCentered
            trapFocus={false}
        >
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />

            <ModalContent
                py={5}
                borderRadius="0px"
                w={['88%', '40%']}
                // overflow="hidden"
                maxH="100vh"
                pos="fixed"
                mt="1rem"
                mb="1rem"
                maxW="100%"
            >
                <ModalHeader textAlign="center" w="80%" mx="auto">
                    <Flex justify="space-between">
                        <Text
                            color="black"
                            fontSize="20px"
                            textAlign="left"
                            fontWeight="bold"
                        >
                            Pause Subscription Renewal
                        </Text>
                        <Icon as={GrClose} onClick={onClose} cursor="pointer" />
                    </Flex>
                </ModalHeader>

                <ModalBody>
                    <Box overflowY="auto" w="80%" mx="auto">
                        <Text fontSize=".875rem" color="#696969" mb="3rem">
                            The subscription plan cannot be manually renewed.
                            After the suspension expires, it will be
                            automatically resumed and the subscription fee is
                            deducted.
                        </Text>
                        <Box>
                            <PrimaryRadio<PauseModel>
                                radios={['1 month', '3 month', '6 month']}
                                name="duration"
                                control={control}
                                error={errors.duration}
                            />
                        </Box>
                        <HStack
                            spacing="0"
                            gap="2rem"
                            justify="center"
                            mt="3rem"
                        >
                            <Button
                                w="full"
                                bgColor="brand.400"
                                color="white"
                                border="5px"
                                fontSize="14px"
                                borderRadius="5px"
                                h="3rem"
                                isLoading={isSubmitting}
                                onClick={handleSubmit(onSubmit)}
                                spinner={<BeatLoader size={8} color="white" />}
                            >
                                Pause Subscription
                            </Button>
                        </HStack>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
