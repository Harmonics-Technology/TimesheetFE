import {
    Box,
    Image,
    Text,
    Flex,
    Button,
    VStack,
    useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';
import Link from 'next/link';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import { PasswordReset, UserService } from 'src/services';
import InputBlank from '@components/bits-utils/InputBlank';
import BeatLoader from 'react-spinners/BeatLoader';
import YupPassword from 'yup-password';
YupPassword(yup);

const schema = yup.object().shape({
    newPassword: yup
        .string()
        .minUppercase(1, 'Password must contain atleast one uppercase')
        .min(8, 'Password must contain atleast 8 characters')
        .minNumbers(1, 'Password must contain atleast one number')
        .minSymbols(1, 'Password must contain atleast one symbol'),
    code: yup.string(),
});

const CompleteReset = ({ code }: { code: string }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PasswordReset>({
        resolver: yupResolver(schema),
        defaultValues: {
            code: code,
        },
        mode: 'all',
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);
    const [confirmPass, setConfirmPass] = useState('');
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [passwordVisibleB, setPasswordVisibleB] = useState<boolean>(false);
    const changeInputType = () => {
        setPasswordVisible(!passwordVisible);
    };
    const changeInputTypeB = () => {
        setPasswordVisibleB(!passwordVisibleB);
    };
    const toast = useToast();

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
        //
        try {
            const result = (await UserService.completeReset(
                data,
            )) as unknown as any;
            if (result.result.status) {
                setShowSuccess(true);
                return;
            }
            toast({
                title: result.result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            setShowError(true);
        } catch (error) {
            toast({
                title: `Check your network connection and try again`,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    return (
        <>
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
                        my="2rem"
                    >
                        <Image src="/assets/newlogo.png" h="3rem" />
                    </Box>
                    <Text
                        fontSize="35px"
                        fontWeight="bold"
                        w={['100%', '100%']}
                        lineHeight="1"
                        textAlign="center"
                        mb="1rem"
                    >
                        Reset Password!
                    </Text>

                    {showError && (
                        <Flex
                            bgColor="red.100"
                            borderRadius="6px"
                            p=".5rem 1rem"
                            mb="1rem"
                        >
                            <Text fontSize=".9rem" color="red">
                                Error: Password reset link can be used only once
                                and it seems like this code has been used
                                before. If not so, please contact admin.
                            </Text>
                        </Flex>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {showSuccess ? (
                            <Flex flexDirection="column" align="center">
                                <Text
                                    fontSize="1rem"
                                    w="70%"
                                    fontWeight="500"
                                    textAlign="center"
                                    mb="1rem"
                                >
                                    Password reset completed, you can now{' '}
                                    <Link href="/login" passHref>
                                        <Text
                                            as="span"
                                            fontWeight="700"
                                            cursor="pointer"
                                        >
                                            Login{' '}
                                        </Text>
                                    </Link>
                                    with new credentials
                                </Text>
                                <Link href="/login" passHref>
                                    <Button
                                        w="full"
                                        p="1.5rem 0"
                                        color="white"
                                        bgColor="brand.400"
                                        // mt={["2rem", "0"]}
                                    >
                                        Proceed to Login
                                    </Button>
                                </Link>
                            </Flex>
                        ) : (
                            <VStack w="full" spacing="1rem">
                                <PrimaryInput<PasswordReset>
                                    register={register}
                                    name="newPassword"
                                    error={errors.newPassword}
                                    defaultValue=""
                                    placeholder="*********"
                                    type={passwordVisible ? 'text' : 'password'}
                                    icon={true}
                                    passwordVisible={passwordVisible}
                                    changeVisibility={changeInputType}
                                    label="New Password"
                                    fontSize="1rem"
                                />

                                <InputBlank
                                    label="Confirm Password"
                                    placeholder="*********"
                                    fontSize="1rem"
                                    type={
                                        passwordVisibleB ? 'text' : 'password'
                                    }
                                    icon={true}
                                    passwordVisible={passwordVisibleB}
                                    changeVisibility={changeInputTypeB}
                                    onChange={(e: any) =>
                                        setConfirmPass(e.target.value)
                                    }
                                />

                                <Button
                                    variant="solid"
                                    type="submit"
                                    isLoading={isSubmitting}
                                    spinner={
                                        <BeatLoader color="white" size="10" />
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
                        )}
                    </form>
                </Box>
            </Flex>
        </>
    );
};

export default CompleteReset;
