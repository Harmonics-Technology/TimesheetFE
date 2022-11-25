import {
    Box,
    Flex,
    HStack,
    Image,
    Text,
    Link,
    VStack,
    Button,
    useToast,
    Checkbox,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
// import {
//     AdminService,
//     LoginModel,
//     OpenAPI,
//     UserViewStandardResponse,
// } from "Services";
interface LoginModel {
    email: string;
    password: string;
}
import { PrimaryInput } from "@components/bits-utils/PrimaryInput";
import { UserContext } from "@components/context/UserContext";
const schema = yup.object().shape({
    email: yup.string().required("Email is required"),
    password: yup.string().required("Password is required"),
});

function ForgotPassword() {
    const router = useRouter();
    const { setAdmin } = useContext(UserContext);
    const path = Cookies.get("path") as string;
    const toast = useToast();
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<LoginModel>({
        resolver: yupResolver(schema),
        mode: "all",
    });

    const onSubmit = async (data: LoginModel) => {
        // try {
        //     const result = (await AdminService.authenticate(
        //         data,
        //     )) as UserViewStandardResponse;
        //     if (result.status) {
        //         OpenAPI.TOKEN = result?.data?.token as string;
        //         toast({
        //             title: `show toast`,
        //             status: "success",
        //             isClosable: true,
        //         });
        //         setAdmin(result.data);
        //         Cookies.set("admin", JSON.stringify(result.data));
        //         result.data &&
        //             Cookies.set("token", result.data.token as string);
        //         if (typeof path === "string" && path.trim().length === 0) {
        //             router.push(path);
        //             return;
        //         }
        //         router.push("/admin/dashboard");
        //         return;
        //     }
        //     toast({
        //         title: `show toast`,
        //         status: "error",
        //         isClosable: true,
        //     });
        //     return;
        // } catch (error) {
        //     console.log(error);
        //     toast({
        //         title: `show toast`,
        //         status: "error",
        //         isClosable: true,
        //     });
        // }
    };
    return (
        <Flex w="full" h="100vh" justify="center" alignItems="center">
            <Box
                w="35%"
                mx="auto"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 10%)"
                p="1rem 3rem 4rem"
            >
                <Box display="flex" justifyContent="center" w="full" my="2rem">
                    <Image src="/assets/logo.png" h="3rem" />
                </Box>
                <Text
                    fontSize="35px"
                    fontWeight="bold"
                    w={["100%", "100%"]}
                    lineHeight="1"
                    textAlign="center"
                >
                    Recover Password!
                </Text>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <VStack w="full" spacing=".7rem">
                        <PrimaryInput<LoginModel>
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
