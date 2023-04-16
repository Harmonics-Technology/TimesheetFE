import {
    Box,
    Flex,
    HStack,
    Icon,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    VStack,
    useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { GrClose } from 'react-icons/gr';
import { ShiftBtn } from './ShiftBtn';
import { LeaveService, TeamMemberModel } from 'src/services';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { SingleText } from './SingleText';

interface ExportProps {
    isOpen: any;
    onClose: any;
    data: any;
}

const schema = yup.object().shape({});

export const PublishShiftModal = ({ isOpen, onClose, data }: ExportProps) => {
    const router = useRouter();
    const toast = useToast();

    const start = router?.query?.from || startOfWeek(new Date());
    const end = router?.query?.to || endOfWeek(new Date());

    console.log({ start, end, data });

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<TeamMemberModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {},
    });

    const onSubmit = async (data: any) => {
        try {
            const result = await LeaveService.createLeave(data);
            if (result.status) {
                toast({
                    title: result.message,
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
                title: err?.body?.message || err?.message,
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
                <ModalHeader textAlign="center">
                    <Flex justify="space-between">
                        <Text
                            color="black"
                            fontSize="1.1rem"
                            textAlign="center"
                            fontWeight="semibold"
                        >
                            Publish this schedule
                        </Text>
                        <Icon as={GrClose} onClick={onClose} cursor="pointer" />
                    </Flex>
                </ModalHeader>

                <ModalBody>
                    <Box maxH="77vh" overflowY="auto" px={[2, 5]}>
                        <Box
                            bgColor="rgba(46, 175, 163, 0.09)"
                            color="#2D3748"
                            p="2rem 2rem 1rem"
                        >
                            <VStack
                                align="flex-start"
                                gap="2.5rem"
                                spacing="0"
                                w="full"
                                mb="3rem"
                            >
                                <SingleText
                                    text={`${format(
                                        new Date(start as any),
                                        'MMM dd',
                                    )} - ${format(
                                        new Date(end as any),
                                        'MMM dd yyyy',
                                    )}`}
                                />
                                <HStack
                                    justify="space-between"
                                    align="center"
                                    w="full"
                                >
                                    <SingleText text={'Total Shifts:'} />
                                    <SingleText text={'13 Shifts'} />
                                </HStack>
                                <HStack
                                    justify="space-between"
                                    align="center"
                                    w="full"
                                >
                                    <SingleText text={'Total Hours:'} />
                                    <SingleText text={'72 Hours'} />
                                </HStack>
                                <HStack
                                    justify="space-between"
                                    align="center"
                                    w="full"
                                >
                                    <SingleText
                                        text={'Shifts Added/Changed/Deleted::'}
                                    />
                                    <SingleText text={'0'} />
                                </HStack>
                            </VStack>
                        </Box>
                        <Flex
                            borderTop="1px solid"
                            borderColor="gray.300"
                            py="2rem"
                            my="4rem"
                            w="full"
                            justify="center"
                        >
                            <ShiftBtn
                                text="Publish and send notification"
                                bg="brand.400"
                                onClick={handleSubmit(onSubmit)}
                                loading={isSubmitting}
                            />
                        </Flex>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
