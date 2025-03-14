import {
    Box,
    Button,
    Flex,
    HStack,
    Text,
    Image,
    Circle,
    Icon,
    VStack,
    useToast,
} from '@chakra-ui/react';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import React, { useState } from 'react';
import { MdCheck, MdCheckCircle } from 'react-icons/md';
import BeatLoader from 'react-spinners/BeatLoader';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { TimbaUserActivationModel, UserService } from 'src/services';
import Link from 'next/link';
import { useRouter } from 'next/router';

const schema = yup.object().shape({
    code: yup.string(),
    timbaId: yup.string().required(),
    superAdminId: yup.string(),
});

export const CompleteResetExtra = ({
    code,
    superAdminId,
}: {
    code: string;
    superAdminId: string;
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<TimbaUserActivationModel>({
        resolver: yupResolver(schema),
        defaultValues: {
            code,
            superAdminId,
        },
        mode: 'all',
    });
    const typesOfUser = [
        {
            id: 1,
            label: 'New User',
            desc: 'I don’t have an existing Timba account',
        },
        {
            id: 2,
            label: 'Existing User',
            desc: 'I have been onboarded on Timba before. I have a Timba account',
        },
    ];
    const [userType, setUserType] = useState(0);
    const [selectedType, setSelectedType] = useState(0);
    const toast = useToast();
    const router = useRouter();
    const [showSuccess, setShowSuccess] = useState(false);

    const onSubmit = async (data: TimbaUserActivationModel) => {
        try {
            const result = await UserService.completeTimbaUserActivation(data);
            if (result.status) {
                setShowSuccess(true);
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (error: any) {
            toast({
                title: error?.body?.message || error?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const redirectBasedOnSelection = () => {
        setSelectedType(userType);
        if (userType == 1) {
            router?.push(`/password/reset/${code}`);
        }
    };
    return (
        <>
            {selectedType == 2 ? (
                <Flex w="full" h="100vh" justify="center" alignItems="center">
                    <Box
                        w={['full', '35%']}
                        mx="auto"
                        boxShadow="0 20px 27px 0 rgb(0 0 0 / 10%)"
                        h={['full', 'auto']}
                        p="1rem 3rem 4rem"
                    >
                        <Box
                            display="flex"
                            justifyContent="center"
                            w="full"
                            my="1.5rem"
                        >
                            <Image src="/assets/newlogo.png" h="3rem" />
                        </Box>

                        <Box>
                            {showSuccess ? (
                                <Flex
                                    flexDirection="column"
                                    align="center"
                                    mt="3rem"
                                >
                                    <Text
                                        fontSize="1rem"
                                        w="90%"
                                        fontWeight="500"
                                        textAlign="center"
                                        mb="1rem"
                                    >
                                        Account activation complete, you can now{' '}
                                        <Link href="/login" passHref>
                                            <Text
                                                as="span"
                                                fontWeight="700"
                                                cursor="pointer"
                                            >
                                                Login{' '}
                                            </Text>
                                        </Link>
                                        with your existing credentials
                                    </Text>
                                    <Link href="/login" passHref>
                                        <Button
                                            w="full"
                                            p="1.5rem 0"
                                            color="white"
                                            bgColor="brand.400"
                                            mt="1rem"
                                            // mt={["2rem", "0"]}
                                        >
                                            Proceed to Login
                                        </Button>
                                    </Link>
                                </Flex>
                            ) : (
                                <>
                                    <Text
                                        fontSize="20px"
                                        fontWeight="bold"
                                        w={['100%', '100%']}
                                        lineHeight="1"
                                        textAlign="center"
                                        mb="3rem"
                                    >
                                        Please Enter Your Timba ID
                                    </Text>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <VStack w="full" spacing="1rem">
                                            <PrimaryInput<TimbaUserActivationModel>
                                                register={register}
                                                schema={schema}
                                                name="timbaId"
                                                error={errors.timbaId}
                                                defaultValue=""
                                                label="Timba ID"
                                                fontSize="1rem"
                                            />

                                            <Button
                                                variant="solid"
                                                type="submit"
                                                isLoading={isSubmitting}
                                                spinner={
                                                    <BeatLoader
                                                        color="white"
                                                        size="10"
                                                    />
                                                }
                                                w="full"
                                                p="1.5rem 0"
                                                color="white"
                                                bgColor="brand.400"
                                                mt="1rem"
                                            >
                                                Continue
                                            </Button>
                                        </VStack>
                                    </form>
                                </>
                            )}
                        </Box>
                    </Box>
                </Flex>
            ) : (
                <Flex w="full" h="100vh" justify="center" alignItems="center">
                    <Box
                        w={['full', '40%']}
                        mx="auto"
                        boxShadow="0 20px 27px 0 rgb(0 0 0 / 10%)"
                        h={['full', 'auto']}
                        p="1rem 3rem 4rem"
                    >
                        <Box
                            display="flex"
                            justifyContent="center"
                            w="full"
                            my="2rem"
                        >
                            <Image src="/assets/newlogo.png" h="3rem" />
                        </Box>
                        <Text
                            fontSize="20px"
                            fontWeight="bold"
                            w={['100%', '100%']}
                            lineHeight="1"
                            textAlign="center"
                            mb=".8rem"
                        >
                            Choose A Timba User Category
                        </Text>
                        <Text
                            fontSize="14px"
                            w={['100%', '100%']}
                            lineHeight="1"
                            textAlign="center"
                        >
                            Kindly choose which category best describes you as a
                            Timba User
                        </Text>

                        <HStack gap="15px" w="full" my="40px">
                            {typesOfUser?.map((x) => (
                                <Box
                                    border={
                                        userType == x?.id
                                            ? '2px solid #2EAFA3'
                                            : '1px solid #A6ACBE'
                                    }
                                    borderRadius="10px"
                                    onClick={() => setUserType(x?.id)}
                                    p="18px 15px"
                                    minH="107px"
                                    w="full"
                                    cursor="pointer"
                                >
                                    <HStack justify="space-between" mb="1rem">
                                        <Text fontWeight="bold" color="#212121">
                                            {x?.label}
                                        </Text>
                                        {userType == x?.id ? (
                                            <Circle
                                                bgColor="brand.400"
                                                size="18px"
                                            >
                                                <Icon
                                                    as={MdCheck}
                                                    color="white"
                                                    fontSize="13px"
                                                />
                                            </Circle>
                                        ) : (
                                            <Circle
                                                border="1px solid #6A7F9D"
                                                size="18px"
                                            />
                                        )}
                                    </HStack>
                                    <Text color="#80807F" fontSize="14px">
                                        {x?.desc}
                                    </Text>
                                </Box>
                            ))}
                        </HStack>
                        <HStack justify="center">
                            <Button
                                variant="solid"
                                w="80%"
                                h="48px"
                                color="white"
                                bgColor="brand.400"
                                onClick={redirectBasedOnSelection}
                            >
                                Continue
                            </Button>
                        </HStack>
                    </Box>
                </Flex>
            )}
        </>
    );
};
