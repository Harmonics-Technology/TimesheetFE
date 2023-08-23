import {
    Box,
    Flex,
    Image,
    Text,
    Link,
    VStack,
    Button,
    useToast,
    Checkbox,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import { useContext, useEffect, useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
// import Checkbox from '@components/bits-utils/Checkbox';
interface LoginModel {
    email: string;
    password: string;
}
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import { UserContext } from '@components/context/UserContext';
import { OpenAPI, UserService, UserViewStandardResponse } from 'src/services';
import BeatLoader from 'react-spinners/BeatLoader';

const schema = yup.object().shape({
    email: yup.string().required('Email is required'),
    password: yup.string().required('Password is required'),
});

function Login() {
    const router = useRouter();
    const { setUser } = useContext(UserContext);
    const toast = useToast();
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [rememberedData, setRememberedData] = useState<any>();
    const [rememberMe, setRememberMe] = useState(rememberedData?.rememberMe);
    // console.log({ rememberedData, rememberMe });
    const changeInputType = () => {
        setPasswordVisible(!passwordVisible);
    };
    const {
        handleSubmit,
        register,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<LoginModel>({
        resolver: yupResolver(schema),
        mode: 'all',
    });
    const expiresIn = new Date(new Date().getTime() + 15 * 60 * 1000);
    // console.log({expiresIn})
    const onSubmit = async (data: LoginModel) => {
        try {
            const result = (await UserService.loginUser(
                data,
            )) as UserViewStandardResponse;
            if (result.status) {
                if (rememberMe) {
                    Cookies.set(
                        'details',
                        JSON.stringify({
                            email: data.email,
                            pass: data.password,
                            rememberMe: rememberMe,
                        }),
                    );
                }
                setUser(result.data);

                Cookies.set('user', JSON.stringify(result.data));
                OpenAPI.TOKEN = result?.data?.token as string;
                result.data &&
                    Cookies.set('token', result.data.token as string, {
                        // expires: expiresIn,
                    });
                if (result.data?.twoFactorEnabled) {
                    router.push('/login/twofalogin');
                    return;
                }
                toast({
                    title: `Login Successful`,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.query.from
                    ? (window.location.href = decodeURIComponent(
                          router.query.from as unknown as string,
                      ))
                    : (window.location.href = `${result?.data?.role?.replaceAll(
                          ' ',
                          '',
                      )}/dashboard`);
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            return;
        } catch (error: any) {
            // console.log({ error });
            toast({
                title: error?.message || error?.body?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    // console.log(watch('email'), watch('password'));

    useEffect(() => {
        const isUser = Cookies.get('details');
        if (isUser !== undefined) {
            const userDetails = JSON.parse(isUser as unknown as string);
            setRememberedData(userDetails);
            reset({
                email: userDetails.email,
                password: userDetails.pass,
            });
        }
    }, []);
    return (
        <Flex w="full" h="100vh" justify="center" alignItems="center">
            <Box
                w={['full', '35%']}
                mx="auto"
                boxShadow={['0', '0 20px 27px 0 rgb(0 0 0 / 10%)']}
                h={['auto', 'auto']}
                p="1rem 3rem 4rem"
            >
                <Box display="flex" justifyContent="center" w="full" my="2rem">
                    <Image src="/assets/newlogo.png" h="3rem" />
                </Box>
                <Text
                    fontSize="35px"
                    fontWeight="bold"
                    w={['100%', '100%']}
                    lineHeight="1"
                    textAlign="center"
                >
                    Sign in!
                </Text>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <VStack w="full" spacing=".7rem">
                        <PrimaryInput<LoginModel>
                            register={register}
                            name="email"
                            error={errors.email}
                            defaultValue={''}
                            type="email"
                            placeholder="Email"
                            label="Email Address"
                            fontSize="1rem"
                        />
                        <PrimaryInput<LoginModel>
                            register={register}
                            name="password"
                            error={errors.password}
                            defaultValue={''}
                            placeholder="*********"
                            type={passwordVisible ? 'text' : 'password'}
                            icon={true}
                            passwordVisible={passwordVisible}
                            changeVisibility={changeInputType}
                            label="Password"
                            fontSize="1rem"
                        />
                        <Button
                            variant="solid"
                            type="submit"
                            isLoading={isSubmitting}
                            spinner={<BeatLoader color="white" size={10} />}
                            w="full"
                            p="1.5rem 0"
                            color="white"
                            bgColor="brand.400"
                            // mt={["2rem", "0"]}
                        >
                            Login
                        </Button>
                        <Flex w="full" justify="space-between">
                            <Checkbox
                                alignItems="center"
                                borderColor="none"
                                borderRadius="5px"
                                size="md"
                                textTransform="capitalize"
                                onChange={() => setRememberMe((prev) => !prev)}
                                defaultChecked={true}
                                isChecked={rememberMe}
                            >
                                remember me.
                            </Checkbox>
                            <NextLink href="/forgot-password" passHref>
                                <Link fontSize="1rem" fontWeight="semibold">
                                    Forgot Password?
                                </Link>
                            </NextLink>
                        </Flex>
                    </VStack>
                </form>
            </Box>
        </Flex>
    );
}

export default Login;
