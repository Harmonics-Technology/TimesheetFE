import {
    Box,
    Button,
    Circle,
    HStack,
    Icon,
    Image,
    Text,
    VStack,
    useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { PrimaryInput } from '../PrimaryInput';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { PrimaryTextarea } from '../PrimaryTextArea';
import { IoCloseCircleSharp } from 'react-icons/io5';
import { BiSupport } from 'react-icons/bi';
import { ContactMessageModel, UtilityService } from 'src/services';
import { BsCheck2Circle } from 'react-icons/bs';

const schema = yup.object().shape({
    fullName: yup.string().required(),
    email: yup.string().email().required(),
    subject: yup.string().required(),
    message: yup.string().required(),
});

export const SupportBox = () => {
    const {
        handleSubmit,
        register,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ContactMessageModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            fullName: '',
            email: '',
            subject: '',
            message: '',
        },
    });

    const [showForm, setShowForm] = useState(false);
    const [success, setSuccess] = useState(false);
    const toast = useToast();

    const onSubmit = async (data: ContactMessageModel) => {
        try {
            const res = await UtilityService.sendContactMessage(data);
            if (res.status) {
                setSuccess(true);
                reset({});
                return;
            }
            toast({ status: 'error', title: res?.message });
        } catch (error: any) {
            toast({
                status: 'error',
                title: error?.body?.message || error?.message,
            });
        }
    };
    return (
        <Box
            pos="fixed"
            right={['1rem', '2rem']}
            bottom="2rem"
            w={['90%', '28%']}
            overflowY="auto"
            maxH="90vh"
        >
            {showForm ? (
                <Box
                    borderRadius="10px"
                    overflow="hidden"
                    border="1px solid #C2CFE0"
                    bgColor="white"
                    w="full"
                    transition=".4s ease-in-out"
                >
                    <HStack
                        color="white"
                        justify="space-between"
                        align="center"
                        bgColor="#182C51"
                        h="4rem"
                        w="full"
                        px="2.2rem"
                    >
                        <Text fontWeight={600}>Timba Support</Text>
                        <Icon
                            as={IoCloseCircleSharp}
                            onClick={() => {
                                setShowForm((prev) => !prev);
                                reset();
                            }}
                            cursor="pointer"
                        />
                    </HStack>

                    {success ? (
                        <VStack py="3rem" gap="1.5rem">
                            <Icon
                                as={BsCheck2Circle}
                                fontSize="3rem"
                                color="green.400"
                            />
                            <Text>Thank you for your message!</Text>
                            <Button
                                bgColor="#182C51"
                                boxShadow="0px 3.5px 5.5px 0px rgba(0, 0, 0, 0.02)"
                                h="2.215rem"
                                borderRadius=".125rem"
                                fontSize=".75rem"
                                color="white"
                                w="69%"
                                onClick={() => setShowForm(false)}
                                fontWeight={700}
                            >
                                Close
                            </Button>
                        </VStack>
                    ) : (
                        <Box w="full" px="2.2rem">
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <VStack
                                    mt="1.56rem"
                                    mb="1.69rem"
                                    w="full"
                                    color="#8c8c8c"
                                    gap="1.5rem"
                                >
                                    <PrimaryInput<ContactMessageModel>
                                        name="fullName"
                                        placeholder="Full Name Or Company Name"
                                        error={errors.fullName}
                                        register={register}
                                        borderRadius=".1875rem"
                                        border="1px solid #C4C4C4"
                                        fontSize=".81rem"
                                    />
                                    <PrimaryInput<ContactMessageModel>
                                        name="email"
                                        placeholder="Email Address"
                                        error={errors.email}
                                        register={register}
                                        borderRadius=".1875rem"
                                        border="1px solid #C4C4C4"
                                        fontSize=".81rem"
                                    />
                                    <PrimaryInput<ContactMessageModel>
                                        name="subject"
                                        placeholder="Subject"
                                        error={errors.subject}
                                        register={register}
                                        borderRadius=".1875rem"
                                        border="1px solid #C4C4C4"
                                        fontSize=".81rem"
                                    />
                                    <PrimaryTextarea<ContactMessageModel>
                                        name="message"
                                        placeholder="Message"
                                        error={errors.message}
                                        register={register}
                                        borderRadius=".1875rem"
                                        border="1px solid #C4C4C4"
                                        fontSize=".81rem"
                                        defaultValue={''}
                                    />
                                </VStack>
                                <Button
                                    bgColor="#182C51"
                                    w="full"
                                    boxShadow="0px 3.5px 5.5px 0px rgba(0, 0, 0, 0.02)"
                                    h="2.215rem"
                                    borderRadius=".125rem"
                                    fontSize=".75rem"
                                    color="white"
                                    fontWeight={700}
                                    type="submit"
                                    isLoading={isSubmitting}
                                >
                                    Submit
                                </Button>
                            </form>
                            <HStack
                                justify="center"
                                gap="1rem"
                                m=".9rem auto .5rem"
                            >
                                <Text
                                    color="#2E5268"
                                    fontSize=".812rem"
                                    fontWeight={500}
                                >
                                    Powered by
                                </Text>
                                <Box h="1.8rem">
                                    <Image src="/assets/newlogo.png" h="full" />
                                </Box>
                            </HStack>
                        </Box>
                    )}
                </Box>
            ) : (
                <Circle
                    size="3.125rem"
                    bgColor="#182C51"
                    color="white"
                    fontSize="1.8rem"
                    onClick={() => setShowForm((prev) => !prev)}
                    cursor="pointer"
                    ml="auto"
                >
                    <Icon as={BiSupport} />
                </Circle>
            )}
        </Box>
    );
};
