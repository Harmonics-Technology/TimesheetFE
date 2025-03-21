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
import React, { useEffect, useState } from 'react';
import { MdCheck } from 'react-icons/md';
import BeatLoader from 'react-spinners/BeatLoader';
import BarLoader from 'react-spinners/BarLoader';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PasswordReset, UserService } from 'src/services';
import Link from 'next/link';
import { useRouter } from 'next/router';
import InputBlank from '@components/bits-utils/InputBlank';
import { BsFillInfoSquareFill } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai';
import shadeColor from '@components/generics/functions/shadeColor';
import { BiArrowBack } from 'react-icons/bi';
import YupPassword from 'yup-password';
YupPassword(yup);

const schema = yup.object().shape({
    code: yup.string(),
    timbaId: yup.string().required(),
    superAdminId: yup.string(),
});

const passwordSchema = yup.object().shape({
    newPassword: yup
        .string()
        .minUppercase(1, 'Password must contain atleast one uppercase')
        .min(8, 'Password must contain atleast 8 characters')
        .minNumbers(1, 'Password must contain atleast one number')
        .minSymbols(1, 'Password must contain atleast one symbol')
        .required(),
    code: yup.string(),
    superAdminId: yup.string(),
});

export const CompleteResetExtra = ({
    code,
    superAdminId,
    onboard,
    exist,
}: {
    code: string;
    superAdminId: string;
    onboard: string;
    exist: boolean;
}) => {
    const [userType, setUserType] = useState(0);
    const [selectedType, setSelectedType] = useState(0);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PasswordReset>({
        resolver: yupResolver(userType == 1 ? passwordSchema : schema),
        defaultValues: {
            code,
            timbaId: selectedType == 1 || exist ? onboard : undefined,
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

    const toast = useToast();
    const router = useRouter();
    const [showSuccess, setShowSuccess] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [loadExist, setLoadExist] = useState(true);
    const [confirmPass, setConfirmPass] = useState();
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [passwordVisibleB, setPasswordVisibleB] = useState<boolean>(false);
    const changeInputType = () => {
        setPasswordVisible(!passwordVisible);
    };
    const changeInputTypeB = () => {
        setPasswordVisibleB(!passwordVisibleB);
    };

    const onSubmit = async (data: PasswordReset) => {
        if (confirmPass !== data.newPassword) {
            toast({
                title: 'Password do not match',
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            return;
        }
        try {
            const result = await UserService.completeReset(data);
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
        // if (userType == 1) {
        //     router?.push(`/password/reset/${code}`);
        // }
    };

    const timbaOpt = [
        {
            id: 1,
            label: 'On your Email Inbox',
            desc: ' Your Timba ID can be found in the onboarding email you received the very first time you were onboarded on Timba.',
            img: '/assets/frommailb.png',
            img2: '/assets/fromml.png',
        },
        {
            id: 2,
            label: 'On your Profile Page',
            desc: 'Your Timba ID can also be found when you navigate to your profile page under account settings from your side navigation ',
            img: '/assets/fromprof.png',
            img2: '/assets/frompf.png',
        },
    ];

    const [selectedImage, setSelectedImage] = useState<string | null>();

    useEffect(() => {
        if (exist == true) {
            handleSubmit(onSubmit)();
            setTimeout(() => {
                !isSubmitting && setLoadExist(false);
            }, 5000);
        }
    }, []);

    return (
        <>
            {exist ? (
                <>
                    <Flex
                        w="full"
                        h="100vh"
                        justify="center"
                        alignItems="center"
                    >
                        <Box w={['full', '35%']}>
                            <Box
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

                                <Box mt="3rem">
                                    {loadExist ? (
                                        <Box w="full">
                                            <Text
                                                fontSize="1rem"
                                                fontWeight="700"
                                                textAlign="center"
                                                mb="1rem"
                                            >
                                                Duplicate Email Detected
                                            </Text>
                                            <BarLoader
                                                color="#2EAFA3"
                                                width="100%"
                                            />
                                            <Text
                                                fontSize="1rem"
                                                w="90%"
                                                fontWeight="500"
                                                textAlign="center"
                                                mt="1rem"
                                            >
                                                Your email address is already
                                                registered with Timba and will
                                                be automatically linked for a
                                                seamless single sign-in
                                                experience. Please hold on while
                                                we complete the process.
                                            </Text>
                                        </Box>
                                    ) : (
                                        <Flex
                                            flexDirection="column"
                                            align="center"
                                        >
                                            <Text
                                                fontSize="1rem"
                                                w="90%"
                                                fontWeight="500"
                                                textAlign="center"
                                                mb="1rem"
                                            >
                                                Account linking and activation
                                                is complete, you can now{' '}
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
                                    )}
                                </Box>
                            </Box>
                        </Box>
                    </Flex>
                </>
            ) : (
                <>
                    {' '}
                    {selectedType == 1 ? (
                        <Flex
                            w="full"
                            h="100vh"
                            justify="center"
                            alignItems="center"
                        >
                            <Box w={['full', '35%']}>
                                <HStack
                                    onClick={() => setSelectedType(0)}
                                    cursor="pointer"
                                    fontWeight={600}
                                >
                                    <Icon as={BiArrowBack} />
                                    <Text>Back</Text>
                                </HStack>
                                <Box
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
                                        <Image
                                            src="/assets/newlogo.png"
                                            h="3rem"
                                        />
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
                                                    Account activation complete,
                                                    you can now{' '}
                                                    <Link
                                                        href="/login"
                                                        passHref
                                                    >
                                                        <Text
                                                            as="span"
                                                            fontWeight="700"
                                                            cursor="pointer"
                                                        >
                                                            Login{' '}
                                                        </Text>
                                                    </Link>
                                                    with your existing
                                                    credentials
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
                                                    Reset Password
                                                </Text>
                                                <form
                                                    onSubmit={handleSubmit(
                                                        onSubmit,
                                                    )}
                                                >
                                                    <VStack
                                                        w="full"
                                                        spacing="1rem"
                                                    >
                                                        <PrimaryInput<PasswordReset>
                                                            register={register}
                                                            schema={
                                                                passwordSchema
                                                            }
                                                            name="newPassword"
                                                            error={
                                                                errors.newPassword
                                                            }
                                                            defaultValue=""
                                                            placeholder="*********"
                                                            type={
                                                                passwordVisible
                                                                    ? 'text'
                                                                    : 'password'
                                                            }
                                                            icon={true}
                                                            passwordVisible={
                                                                passwordVisible
                                                            }
                                                            changeVisibility={
                                                                changeInputType
                                                            }
                                                            label="New Password"
                                                            fontSize="1rem"
                                                        />

                                                        <InputBlank
                                                            label="Confirm Password"
                                                            placeholder="*********"
                                                            required
                                                            fontSize="1rem"
                                                            type={
                                                                passwordVisibleB
                                                                    ? 'text'
                                                                    : 'password'
                                                            }
                                                            icon={true}
                                                            passwordVisible={
                                                                passwordVisibleB
                                                            }
                                                            changeVisibility={
                                                                changeInputTypeB
                                                            }
                                                            onChange={(
                                                                e: any,
                                                            ) =>
                                                                setConfirmPass(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                        />

                                                        <Button
                                                            variant="solid"
                                                            type="submit"
                                                            isLoading={
                                                                isSubmitting
                                                            }
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
                                                            // mt={["2rem", "0"]}
                                                        >
                                                            Complete Reset
                                                        </Button>
                                                    </VStack>
                                                </form>
                                            </>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                        </Flex>
                    ) : selectedType == 2 ? (
                        <Flex
                            w="full"
                            h="100vh"
                            justify="center"
                            alignItems="center"
                            pos="relative"
                        >
                            <Box w={['full', '35%']}>
                                <HStack
                                    onClick={() => setSelectedType(0)}
                                    cursor="pointer"
                                    fontWeight={600}
                                >
                                    <Icon as={BiArrowBack} />
                                    <Text>Back</Text>
                                </HStack>
                                <Box
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
                                        <Image
                                            src="/assets/newlogo.png"
                                            h="3rem"
                                        />
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
                                                    Account activation complete,
                                                    you can now{' '}
                                                    <Link
                                                        href="/login"
                                                        passHref
                                                    >
                                                        <Text
                                                            as="span"
                                                            fontWeight="700"
                                                            cursor="pointer"
                                                        >
                                                            Login{' '}
                                                        </Text>
                                                    </Link>
                                                    with your existing
                                                    credentials
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
                                                <form
                                                    onSubmit={handleSubmit(
                                                        onSubmit,
                                                    )}
                                                >
                                                    <VStack
                                                        w="full"
                                                        spacing="1rem"
                                                    >
                                                        <PrimaryInput<PasswordReset>
                                                            register={register}
                                                            schema={schema}
                                                            name="timbaId"
                                                            error={
                                                                errors.timbaId
                                                            }
                                                            defaultValue=""
                                                            label="Timba ID"
                                                            fontSize="1rem"
                                                        />

                                                        <Button
                                                            variant="solid"
                                                            type="submit"
                                                            isLoading={
                                                                isSubmitting
                                                            }
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
                                                            mt="2rem"
                                                        >
                                                            Continue
                                                        </Button>
                                                    </VStack>
                                                </form>

                                                <HStack
                                                    gap="4px"
                                                    mt="14px"
                                                    justify="center"
                                                    cursor="pointer"
                                                    onClick={() =>
                                                        setShowInfo(true)
                                                    }
                                                >
                                                    <Icon
                                                        as={
                                                            BsFillInfoSquareFill
                                                        }
                                                        color="#1A202C"
                                                    />
                                                    <Text
                                                        color="#1A202C"
                                                        fontWeight={600}
                                                    >
                                                        How can I view My Timba
                                                        ID ?
                                                    </Text>
                                                </HStack>
                                            </>
                                        )}
                                    </Box>
                                </Box>
                            </Box>
                            {showInfo && (
                                <Box
                                    pos="absolute"
                                    bgColor="rgba(0,0,0,.7)"
                                    bottom={0}
                                    w="full"
                                    h="full"
                                >
                                    <Box
                                        // bgColor={shadeColor(
                                        //     '#2EAFA3',
                                        //     0.2,
                                        // )}
                                        bgColor="white"
                                        w="32%"
                                        pos="relative"
                                        top="50%"
                                        left="50%"
                                        transform="translate(-50%, -50%)"
                                        p="1rem"
                                        borderRadius="8px"
                                        border="1px solid"
                                        borderColor={shadeColor('#2EAFA3', 0.6)}
                                        mt="1rem"
                                    >
                                        <HStack
                                            justify="end"
                                            mb=".5rem"
                                            gap=".2rem"
                                            fontSize=".7rem"
                                            cursor="pointer"
                                            onClick={() => setShowInfo(false)}
                                        >
                                            <Icon as={AiOutlineClose} />
                                            <Text>Close</Text>
                                        </HStack>
                                        <Text
                                            fontWeight={600}
                                            textAlign="center"
                                            mb="1rem"
                                        >
                                            How to find your Timba ID
                                        </Text>

                                        <ul>
                                            {timbaOpt?.map((x) => (
                                                <>
                                                    <ol
                                                        style={{
                                                            display:
                                                                'list-item',
                                                            listStylePosition:
                                                                'inside',
                                                            fontSize: '.8rem',
                                                        }}
                                                    >
                                                        <b>{x?.label}:</b>
                                                        {x?.desc}
                                                    </ol>
                                                    <Image
                                                        src={x?.img}
                                                        w="full"
                                                        h="88px"
                                                        objectFit="cover"
                                                        my="1rem"
                                                        cursor="pointer"
                                                        // border="1px solid #A6ACBE"
                                                        borderRadius="4px"
                                                        onClick={() =>
                                                            setSelectedImage(
                                                                x?.img2,
                                                            )
                                                        }
                                                    />
                                                </>
                                            ))}
                                        </ul>
                                    </Box>
                                </Box>
                            )}
                            {selectedImage && (
                                <Box
                                    pos="absolute"
                                    w="full"
                                    h="full"
                                    overflow="hidden"
                                    bgColor="rgba(0,0,0,.8)"
                                >
                                    <VStack justify="center" h="100vh">
                                        <HStack
                                            justify="end"
                                            mb=".5rem"
                                            gap=".2rem"
                                            fontSize="1rem"
                                            cursor="pointer"
                                            onClick={() =>
                                                setSelectedImage(undefined)
                                            }
                                            color="white"
                                            w="80%"
                                        >
                                            <Icon as={AiOutlineClose} />
                                            <Text>Close</Text>
                                        </HStack>
                                        <HStack w="80%">
                                            <Image
                                                src={selectedImage}
                                                w="full"
                                                h="auto"
                                            />
                                        </HStack>
                                    </VStack>
                                </Box>
                            )}
                        </Flex>
                    ) : (
                        <Flex
                            w="full"
                            h="100vh"
                            justify="center"
                            alignItems="center"
                        >
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
                                    Kindly choose which category best describes
                                    you as a Timba User
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
                                            <HStack
                                                justify="space-between"
                                                mb="1rem"
                                            >
                                                <Text
                                                    fontWeight="bold"
                                                    color="#212121"
                                                >
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
                                            <Text
                                                color="#80807F"
                                                fontSize="14px"
                                            >
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
            )}
        </>
    );
};
