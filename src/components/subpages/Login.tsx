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
    Icon,
    Divider,
    Spinner,
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
import { useIsAuthenticated, useMsal } from '@azure/msal-react';
import { AuthError, InteractionStatus } from '@azure/msal-browser';
import { BsMicrosoft } from 'react-icons/bs';

const schema = yup.object().shape({
    email: yup.string().required('Email is required'),
    password: yup.string().required('Password is required'),
});

function Login() {
    const router = useRouter();
    // const { setUser } = useContext(UserContext);
    const toast = useToast();
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const msal = useMsal();

    //
    const changeInputType = () => {
        setPasswordVisible(!passwordVisible);
    };
    const {
        handleSubmit,
        register,
        reset,
        formState: { errors, isSubmitting, isValid },
    } = useForm<LoginModel>({
        resolver: yupResolver(schema),
        mode: 'all',
    });
    const expiresIn =
        process.env.NODE_ENV == 'development'
            ? 7
            : new Date(new Date().getTime() + 2 * 60 * 60 * 1000);
    //
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
                } else {
                    Cookies.remove('details');
                }

                const strippedData = {
                    clientSubscriptionId: result.data?.clientSubscriptionId,
                    email: result.data?.email,
                    firstName: result.data?.firstName,
                    lastName: result.data?.lastName,
                    fullName: result.data?.fullName,
                    role: result.data?.role,
                    isActive: result.data?.isActive,
                    isAnniversaryToday: result.data?.isAnniversaryToday,
                    isBirthDayToday: result.data?.isBirthDayToday,
                    isOrganizationProjectManager:
                        result.data?.isOrganizationProjectManager,
                    organizationName: result.data?.organizationName,
                    superAdminId: result.data?.superAdminId,
                    twoFactorEnabled: result.data?.twoFactorEnabled,
                    currency: result.data?.currency,
                    department: result.data?.department,
                    employeeInformationId: result.data?.employeeInformationId,
                    id: result.data?.id,
                    numberOfDaysEligible: result.data?.numberOfDaysEligible,
                    numberOfLeaveDaysTaken: result.data?.numberOfLeaveDaysTaken,
                    twoFactorCode: result.data?.twoFactorCode,
                    isTrainingManager: result.data?.isTrainingManager,
                    clientId: result.data?.clientId,
                };
                const subDetails = result.data?.subscriptiobDetails;
                Cookies.set('user', JSON.stringify(strippedData));
                Cookies.set('subDetails', JSON.stringify(subDetails));
                result.data &&
                    Cookies.set('token', result.data.token as string, {
                        expires: expiresIn,
                    });
                OpenAPI.TOKEN = result?.data?.token as string;

                if (result.data?.twoFactorEnabled) {
                    router.push('/login/twofalogin');
                    return;
                }
                const getControlSettings =
                    await UserService.getControlSettingById(
                        result.data?.superAdminId as string,
                    );
                if (getControlSettings.status) {
                    Cookies.set(
                        'access-controls',
                        JSON.stringify(getControlSettings.data),
                    );
                    toast({
                        title: `Login Successful`,
                        status: 'success',
                        isClosable: true,
                        position: 'top-right',
                    });
                    router.query.from
                        ? router.push(
                              decodeURIComponent(
                                  router.query.from as unknown as string,
                              ),
                          )
                        : router.push(
                              `/${result?.data?.role?.replaceAll(
                                  ' ',
                                  '',
                              )}/dashboard`,
                          );
                }
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
            //
            toast({
                title: error?.message || error?.body?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    //
    const [loading, setLoading] = useState<boolean>(false);
    const authenticate = async () => {
        try {
            setLoading(true);
            const res = await msal.instance.loginPopup();

            msal.instance.setActiveAccount(res.account);

            if (res?.account?.homeAccountId) {
                try {
                    const result = (await UserService.microsoftLogin(
                        res.idTokenClaims,
                    )) as UserViewStandardResponse;
                    if (result.status) {
                        Cookies.set('user', JSON.stringify(result.data));
                        OpenAPI.TOKEN = result?.data?.token as string;
                        result.data &&
                            Cookies.set('token', result.data.token as string, {
                                expires: expiresIn,
                            });
                        setLoading(false);
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
                            ? router.push(
                                  decodeURIComponent(
                                      router.query.from as unknown as string,
                                  ),
                              )
                            : router.push(
                                  `${result?.data?.role?.replaceAll(
                                      ' ',
                                      '',
                                  )}/dashboard`,
                              );
                        return;
                    }
                    toast({
                        title: result.message,
                        status: 'error',
                        isClosable: true,
                        position: 'top-right',
                    });
                    setLoading(false);
                    return;
                } catch (error: any) {
                    toast({
                        title: error?.body?.message || error?.message,
                        status: 'error',
                        isClosable: true,
                        position: 'top-right',
                    });
                    setLoading(false);
                }
            }
            setError('');
        } catch (ex) {
            const authEx = ex as AuthError;
            setError(authEx.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        const isUser = Cookies.get('details');
        if (isUser !== undefined) {
            const userDetails = JSON.parse(isUser as unknown as string);
            setRememberMe(userDetails.rememberMe);
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
                p="1rem 3rem 2rem"
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

                <form onSubmit={(e) => e.preventDefault()}>
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
                            onClick={() => handleSubmit(onSubmit)()}
                            isDisabled={!isValid}
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
                                // defaultChecked={rememberMe}
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

                        <Flex
                            color="gray.400"
                            fontSize=".9rem"
                            align="center"
                            w="full"
                            gap="2rem"
                        >
                            <Divider bgColor="gray.400" />
                            OR
                            <Divider bgColor="gray.400" />
                        </Flex>
                        <Flex
                            // justify="center"

                            w="fit-content"
                            my="1rem"
                            cursor="pointer"
                            onClick={authenticate}
                            bgColor="blackAlpha.800"
                            color="white"
                            h="2.8rem"
                            p=".1rem"
                        >
                            <Flex
                                h="full"
                                w="3rem"
                                bgColor="white"
                                align="center"
                                justify="center"
                                fontSize="1.5rem"
                            >
                                {loading ? (
                                    <Spinner size="sm" color="black" />
                                ) : (
                                    <Icon as={BsMicrosoft} color="black" />
                                )}
                            </Flex>
                            <Text p=".7rem 1rem" fontSize=".9rem">
                                Sign in with Microsoft
                            </Text>
                        </Flex>
                    </VStack>
                </form>
            </Box>
        </Flex>
    );
}

export default Login;
