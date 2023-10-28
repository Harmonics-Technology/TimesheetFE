import {
    Box,
    Flex,
    Image,
    Text,
    VStack,
    Button,
    useToast,
    HStack,
    Circle,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useContext } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import { UserContext } from '@components/context/UserContext';
import { OpenAPI, UserService, UserViewStandardResponse } from 'src/services';
import BeatLoader from 'react-spinners/BeatLoader';

interface TwoFaModel {
    code: string;
}
const schema = yup.object().shape({
    code: yup.string().required(''),
});

function TwofaLogin() {
    const router = useRouter();
    const { user } = useContext(UserContext);
    const twoFactorCode = user?.twoFactorCode;
    const toast = useToast();
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting, isValid },
    } = useForm<TwoFaModel>({
        resolver: yupResolver(schema),
        mode: 'all',
    });
    const onSubmit = async (data: TwoFaModel) => {
        try {
            const result =
                (await UserService.completeTowFactorAuthenticationLogin(
                    data.code,
                    twoFactorCode,
                )) as UserViewStandardResponse;
            if (result.status) {
                toast({
                    title: `Login Successful`,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                Cookies.set('user', JSON.stringify(result.data));
                OpenAPI.TOKEN = result?.data?.token as string;
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
            return;
        } catch (error: any) {
            toast({
                title: error?.message || error?.body?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    return (
        <Flex w="full" h="100vh" justify="center" alignItems="center">
            <Box
                w={['full', '55%']}
                mx="auto"
                boxShadow={['0', '0 20px 27px 0 rgb(0 0 0 / 10%)']}
                h={['auto', 'auto']}
                p="1rem 3rem 4rem"
            >
                <Box display="flex" justifyContent="center" w="full" my="2rem">
                    <Image src="/assets/newlogo.png" h="3rem" />
                </Box>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <HStack gap="2rem" flexDir={['column', 'row']}>
                        <Circle size="167px">
                            <Image
                                src="/assets/pass.png"
                                w="full"
                                h="full"
                                objectFit="cover"
                            />
                        </Circle>
                        <VStack
                            w="full"
                            spacing=".7rem"
                            align={['center', 'flex-start']}
                        >
                            <Box>
                                <Text
                                    color="#263238"
                                    fontWeight="500"
                                    lineHeight="150%"
                                    textAlign={['center', 'left']}
                                >
                                    Two factor authentication
                                </Text>
                                <Text
                                    color="#696969"
                                    fontWeight="400"
                                    lineHeight="150%"
                                    fontSize="14px"
                                    textAlign={['center', 'left']}
                                >
                                    A validation code has been sent to your
                                    authenticator app, kindly open app to view
                                    code
                                </Text>
                            </Box>
                            <Flex align="flex-end" w={['95%', '80%']}>
                                <Box w={['80%', '60%']}>
                                    <PrimaryInput<TwoFaModel>
                                        register={register}
                                        name="code"
                                        error={errors.code}
                                        defaultValue=""
                                        type="text"
                                        placeholder=""
                                        label="OTP Code"
                                        fontSize="1rem"
                                    />
                                </Box>
                                <Button
                                    variant="solid"
                                    type="submit"
                                    isLoading={isSubmitting}
                                    spinner={
                                        <BeatLoader color="white" size={10} />
                                    }
                                    color="white"
                                    bgColor="brand.400"
                                    h="2.6rem"
                                    borderRadius="4px"
                                    w="40%"
                                    // mt={["2rem", "0"]}
                                    disabled={!isValid}
                                >
                                    Verify
                                </Button>
                            </Flex>
                        </VStack>
                    </HStack>
                </form>
            </Box>
        </Flex>
    );
}

export default TwofaLogin;
