import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    HStack,
    Box,
    Text,
    useToast,
    Icon,
    Grid,
} from '@chakra-ui/react';
import { ManageBtn } from '@components/bits-utils/ManageBtn';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineClose } from 'react-icons/ai';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
    ProjectInvoiceRecipientModel,
    ProjectManagementService,
} from 'src/services';
import { PrimaryTextarea } from '@components/bits-utils/PrimaryTextArea';

const schema = yup.object().shape({
    organizationName: yup.string().required(),
    email: yup.string().email().required(),
    address: yup.string().required(),
    phone: yup.string(),
});

export const AddRecipientModal = ({
    isOpen,
    onClose,
    superAdminId,
}: {
    isOpen: any;
    onClose: any;
    superAdminId: any;
}) => {
    const router = useRouter();
    const toast = useToast();

    const {
        handleSubmit,
        register,
        reset,
        formState: { errors, isSubmitting, isValid },
    } = useForm<ProjectInvoiceRecipientModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            superAdminId,
            address: '',
            email: '',
            organizationName: '',
            phone: '',
        },
    });

    const addARecipient = async (value: ProjectInvoiceRecipientModel) => {
        // value.superAdminId = superAdminId;
        try {
            const res = await ProjectManagementService.addRecipient(value);
            if (res.status) {
                onClose();
                router.replace(router.asPath);
                reset({});
                toast({
                    title: res.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                return;
            }
            toast({
                title: res.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (err: any) {
            toast({
                title: err?.body?.message || err.message,
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
        >
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />

            <ModalContent
                py={5}
                borderRadius="0px"
                w={['88%', '35%']}
                overflow="hidden"
                maxH="100vh"
                maxW="1000%"
                pos="fixed"
                mt="1rem"
                mb="1rem"
            >
                <ModalHeader textAlign="center">
                    <HStack
                        justify="space-between"
                        borderBottom="1px solid #e7e7e7"
                    >
                        <Text fontSize="1rem" fontWeight="600" color="#2D3748">
                            New Recipient
                        </Text>
                        <Icon as={AiOutlineClose} onClick={onClose} />
                    </HStack>
                </ModalHeader>

                <ModalBody>
                    <Box maxH="77vh" overflowY="auto" px={5}>
                        <Box>
                            <PrimaryInput<ProjectInvoiceRecipientModel>
                                fontSize="14px"
                                label="Customer"
                                register={register}
                                schema={schema}
                                name="organizationName"
                                error={errors?.organizationName}
                                variant="outline"
                                placeholder="Organization name or person"
                            />
                            <Grid
                                mt="19px"
                                gap="10px"
                                templateColumns="repeat(2, 1fr)"
                            >
                                <PrimaryInput<ProjectInvoiceRecipientModel>
                                    fontSize="14px"
                                    label="Email"
                                    register={register}
                                    schema={schema}
                                    name="email"
                                    error={errors?.email}
                                    variant="outline"
                                />
                                <PrimaryInput<ProjectInvoiceRecipientModel>
                                    fontSize="14px"
                                    label="Phone Number (Optional)"
                                    register={register}
                                    schema={schema}
                                    name="phone"
                                    error={errors?.phone}
                                    variant="outline"
                                />
                            </Grid>
                            <PrimaryTextarea<ProjectInvoiceRecipientModel>
                                fontSize="14px"
                                label="Address"
                                register={register}
                                schema={schema}
                                name="address"
                                error={errors?.address}
                                variant="outline"
                                h="90px"
                                placeholder="Enter full address"
                            />
                        </Box>
                        <HStack w="full" justify="space-between" mt="2rem">
                            <ManageBtn
                                onClick={() => {
                                    onClose();
                                }}
                                btn="Cancel"
                                bg="#FF5B79"
                                w="fit-content"
                                h="2.6rem"
                            />
                            <ManageBtn
                                onClick={handleSubmit(addARecipient)}
                                btn="Save"
                                bg="brand.400"
                                w="fit-content"
                                h="2.6rem"
                                isLoading={isSubmitting}
                                disabled={!isValid}
                            />
                        </HStack>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
