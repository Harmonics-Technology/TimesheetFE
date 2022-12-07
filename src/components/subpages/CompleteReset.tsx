import {
    Stack,
    Grid,
    Box,
    Image,
    Text,
    Flex,
    Button,
    VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useState } from "react";
import Link from "next/link";
import { GetServerSidePropsContext } from "next";
import { PrimaryInput } from "@components/bits-utils/PrimaryInput";

const schema = yup.object().shape({
    newPassword: yup.string().required(),
    code: yup.string(),
});

interface LoginModel {
    code: string;
    password: string;
}

const CompleteReset = ({ code }: { code: string }) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginModel>({
        resolver: yupResolver(schema),
        defaultValues: {
            code: code,
        },
        mode: "all",
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [passwordVisibleB, setPasswordVisibleB] = useState<boolean>(false);
    const changeInputType = () => {
        setPasswordVisible(!passwordVisible);
    };
    const changeInputTypeB = () => {
        setPasswordVisibleB(!passwordVisibleB);
    };

    const onSubmit = async (data: LoginModel) => {
        //
    };

    return (
        <>
            <Flex w="full" h="100vh" justify="center" alignItems="center">
                <Box
                    w="35%"
                    mx="auto"
                    boxShadow="0 20px 27px 0 rgb(0 0 0 / 10%)"
                    p="1rem 3rem 4rem"
                >
                    <Box
                        display="flex"
                        justifyContent="center"
                        w="full"
                        my="2rem"
                    >
                        <Image src="/assets/logo.png" h="3rem" />
                    </Box>
                    <Text
                        fontSize="35px"
                        fontWeight="bold"
                        w={["100%", "100%"]}
                        lineHeight="1"
                        textAlign="center"
                    >
                        Reset Password!
                    </Text>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {showSuccess ? (
                            <Flex flexDirection="column" align="center">
                                <Text
                                    fontSize="1rem"
                                    w="70%"
                                    fontWeight="500"
                                    textAlign="center"
                                >
                                    Password reset completed, you can now{" "}
                                    <Link href="/login" passHref>
                                        <Text
                                            as="span"
                                            fontWeight="700"
                                            cursor="pointer"
                                        >
                                            Login{" "}
                                        </Text>
                                    </Link>
                                    with new credentials
                                </Text>
                            </Flex>
                        ) : (
                            <VStack w="full" spacing=".7rem">
                                <PrimaryInput<LoginModel>
                                    register={register}
                                    name="password"
                                    error={errors.password}
                                    defaultValue=""
                                    placeholder="*********"
                                    type={passwordVisible ? "text" : "password"}
                                    icon={true}
                                    passwordVisible={passwordVisible}
                                    changeVisibility={changeInputType}
                                    label="New Password"
                                    fontSize="1rem"
                                />
                                <PrimaryInput<LoginModel>
                                    register={register}
                                    name="password"
                                    error={errors.password}
                                    defaultValue=""
                                    placeholder="*********"
                                    type={
                                        passwordVisibleB ? "text" : "password"
                                    }
                                    icon={true}
                                    passwordVisible={passwordVisibleB}
                                    changeVisibility={changeInputTypeB}
                                    label="Confirm Password"
                                    fontSize="1rem"
                                />
                                <Button
                                    variant="solid"
                                    type="submit"
                                    isLoading={isSubmitting}
                                    w="full"
                                    p="1.5rem 0"
                                    color="white"
                                    bgColor="brand.400"
                                    // mt={["2rem", "0"]}
                                >
                                    Login
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
