import {
    Box,
    Flex,
    Image,
    Text,
    Link,
    VStack,
    Button,
    useToast,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import { InitiateResetModel, UserService } from 'src/services';
import { useRouter } from 'next/router';
import BeatLoader from 'react-spinners/BeatLoader';
const schema = yup.object().shape({
    email: yup.string().required('Email is required'),
});

function ForgotPassword() {
    const toast = useToast();
    const router = useRouter();
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<InitiateResetModel>({
        resolver: yupResolver(schema),
        mode: 'all',
    });

    const onSubmit = async (data: InitiateResetModel) => {
        try {
            const result = await UserService.initiateReset('', data);
            if (result.status) {
                // console.log({ result });
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.push('/login');
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (error) {
            console.log({ error });
            toast({
                title: `check your network connection and try again`,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    return (
        <Flex w="full" h="100vh" justify="center" alignItems="center">
            <Box
                w={['full', '35%']}
                mx="auto"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 10%)"
                h={['full', 'auto']}
                p="1rem 3rem 4rem"
            >
                <Box display="flex" justifyContent="center" w="full" my="2rem">
                    <Image src="/assets/logo.png" h="3rem" />
                </Box>
                <Text
                    fontSize="35px"
                    fontWeight="bold"
                    w={['100%', '100%']}
                    lineHeight="1"
                    textAlign="center"
                >
                    Recover Password!
                </Text>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <VStack w="full" spacing=".7rem">
                        <PrimaryInput<InitiateResetModel>
                            register={register}
                            name="email"
                            error={errors.email}
                            defaultValue=""
                            type="email"
                            placeholder="Chigozie"
                            label="Email Address"
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
                            Recover
                        </Button>
                        <Flex w="full" justify="center">
                            <NextLink href="/login" passHref>
                                <Link fontSize="1rem" fontWeight="semibold">
                                    Back to Sign in
                                </Link>
                            </NextLink>
                        </Flex>
                    </VStack>
                </form>
            </Box>
        </Flex>
    );
}

export default ForgotPassword;
