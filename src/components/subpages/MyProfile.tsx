import {
    Box,
    Button,
    Circle,
    Grid,
    HStack,
    Text,
    useToast,
    Image,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { FaUser } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { VscSaveAs } from "react-icons/vsc";
import { PrimaryInput } from "@components/bits-utils/PrimaryInput";
import { UserContext } from "@components/context/UserContext";
import { UpdateUserModel, UserService } from "src/services";
import InputBlank from "@components/bits-utils/InputBlank";
import Cookies from "js-cookie";
import { PrimaryDate } from "@components/bits-utils/PrimaryDate";
import { DateObject } from "react-multi-date-picker";

const schema = yup.object().shape({
    // firstName: yup.string().required(),
    // lastName: yup.string().required(),
    // role: yup.string().required(),
    // isActive: yup.string().required(),
    // id: yup.string().required(),
});

function MyProfile() {
    const { user, setUser } = useContext(UserContext);
    console.log({ user });
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<UpdateUserModel>({
        resolver: yupResolver(schema),
        mode: "all",
        defaultValues: {
            id: user?.id,
            role: user?.role,
            isActive: user?.isActive,
        },
    });
    const toast = useToast();
    const onSubmit = async (data: UpdateUserModel) => {
        console.log({ data });
        try {
            const result = await UserService.updateUser(data);
            console.log({ result });
            if (result.status) {
                toast({
                    title: "Profile Update Success",
                    status: "success",
                    isClosable: true,
                    position: "top-right",
                });
                setUser(result.data);
                Cookies.set("user", JSON.stringify(result.data));
                return;
            }
            toast({
                title: result.message,
                status: "error",
                isClosable: true,
                position: "top-right",
            });
        } catch (error) {
            console.log(error);
            toast({
                title: `Check your network connection and try again`,
                status: "error",
                isClosable: true,
                position: "top-right",
            });
        }
    };
    return (
        <Box>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <HStack gap="1rem" align="center">
                    <Circle
                        bgColor="brand.600"
                        size="4rem"
                        fontSize="2rem"
                        color="white"
                        overflow="hidden"
                    >
                        {user?.profilePicture ? (
                            <Image
                                src={user?.profilePicture}
                                w="full"
                                h="full"
                                objectFit="cover"
                            />
                        ) : (
                            <FaUser />
                        )}
                    </Circle>
                    <Box>
                        <Text
                            fontSize=".8rem"
                            color="brand.300"
                            fontWeight="bold"
                        >
                            {user?.role} Profile
                        </Text>
                        <Text fontSize=".8rem" color="brand.300" mb="0">
                            {user?.fullName}
                        </Text>
                    </Box>
                </HStack>
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid
                    templateColumns="repeat(3,1fr)"
                    gap="1rem 1rem"
                    my="1.5rem"
                >
                    <Box
                        bgColor="white"
                        borderRadius="15px"
                        padding="1.5rem"
                        boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
                    >
                        <Text
                            fontWeight="600"
                            fontSize="1.1rem"
                            mb="2rem"
                            textTransform="capitalize"
                            fontFamily="Open Sans"
                            color="brand.200"
                        >
                            Personal Information
                        </Text>
                        <Grid gap=".5rem">
                            <PrimaryInput<UpdateUserModel>
                                label="First Name"
                                name="firstName"
                                error={errors.firstName}
                                placeholder=""
                                defaultValue={user?.firstName as string}
                                register={register}
                            />
                            <PrimaryInput<UpdateUserModel>
                                label="Last Name"
                                name="lastName"
                                error={errors.lastName}
                                placeholder=""
                                defaultValue={user?.lastName as string}
                                register={register}
                            />
                            {/* <PrimaryInput<UpdateUserModel>
                                label="Preferred Name"
                                name="isActive"
                                error={errors.isActive}
                                placeholder=""
                                defaultValue={"Adelowomi"}
                                register={register}
                            /> */}
                            <PrimaryDate<UpdateUserModel>
                                control={control}
                                name="isActive"
                                label="Date of Birth"
                                error={errors.isActive}
                                placeholder={user?.active as string}
                                max={new DateObject().subtract(1, "days")}
                            />
                        </Grid>
                    </Box>
                    <Box
                        bgColor="white"
                        borderRadius="15px"
                        padding="1.5rem"
                        boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
                    >
                        <Text
                            fontWeight="600"
                            fontSize="1.1rem"
                            mb="2rem"
                            textTransform="capitalize"
                            fontFamily="Open Sans"
                            color="brand.200"
                        >
                            Contact Information
                        </Text>
                        <Grid gap=".5rem">
                            <InputBlank
                                label="Email"
                                placeholder=""
                                defaultValue={user?.email as string}
                                disableLabel={true}
                            />
                            <PrimaryInput<UpdateUserModel>
                                label="Address"
                                name="organizationAddress"
                                error={errors.organizationAddress}
                                placeholder=""
                                defaultValue={
                                    user?.organizationAddress as string
                                }
                                register={register}
                            />
                            <PrimaryInput<UpdateUserModel>
                                label="Phone No."
                                name="phoneNumber"
                                error={errors.phoneNumber}
                                placeholder=""
                                defaultValue={user?.phoneNumber as string}
                                register={register}
                            />
                        </Grid>
                    </Box>
                    <Box
                        bgColor="white"
                        borderRadius="15px"
                        padding="1.5rem"
                        boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
                    >
                        <Text
                            fontWeight="600"
                            fontSize="1.1rem"
                            mb="2rem"
                            textTransform="capitalize"
                            fontFamily="Open Sans"
                            color="brand.200"
                        >
                            Job Information
                        </Text>
                        <Grid gap=".5rem">
                            <InputBlank
                                label="Company Name"
                                placeholder=""
                                defaultValue={user?.email as string}
                                disableLabel={true}
                            />
                            <InputBlank
                                label="Job Title"
                                placeholder=""
                                defaultValue={user?.email as string}
                                disableLabel={true}
                            />
                            <InputBlank
                                label="Supervisor"
                                placeholder=""
                                defaultValue={user?.email as string}
                                disableLabel={true}
                            />
                        </Grid>
                    </Box>
                </Grid>

                <Box
                    bgColor="white"
                    borderRadius="15px"
                    padding="1.5rem"
                    boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
                    display="flex"
                    justifyContent="center"
                >
                    <Button
                        bgColor="brand.400"
                        color="white"
                        height="4rem"
                        fontSize="15px"
                        type="submit"
                        isLoading={isSubmitting}
                        w="98%"
                        boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                    >
                        <Box pr=".5rem">
                            <VscSaveAs />
                        </Box>
                        <Box>Update</Box>
                    </Button>
                </Box>
            </form>
        </Box>
    );
}

export default MyProfile;
