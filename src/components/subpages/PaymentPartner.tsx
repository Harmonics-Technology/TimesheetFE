import { Box, Button, Grid, Text, useToast } from "@chakra-ui/react";
import { PrimaryInput } from "@components/bits-utils/PrimaryInput";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { VscSaveAs } from "react-icons/vsc";
import { PrimaryTextarea } from "@components/bits-utils/PrimaryTextArea";
import { UpdateUserModel, UserService, UserView } from "src/services";
import InputBlank from "@components/bits-utils/InputBlank";
import { useRouter } from "next/router";
import { SelectrixBox } from "@components/bits-utils/Selectrix";

const schema = yup.object().shape({});
interface PaymentPartnerProps {
    userProfile?: UserView;
}

function PaymentPartner({ userProfile }: PaymentPartnerProps) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<UpdateUserModel>({
        resolver: yupResolver(schema),
        mode: "all",
        defaultValues: {
            id: userProfile?.id,
            isActive: userProfile?.isActive,
            role: userProfile?.role,
        },
    });
    const router = useRouter();
    const toast = useToast();

    const onSubmit = async (data: UpdateUserModel) => {
        data.isActive = data.isActive === ("true" as unknown as boolean);
        console.log({ data });
        console.log({ userProfile });
        if (data == userProfile) {
            return;
        }

        try {
            const result = await UserService.adminUpdateUser(data);
            // console.log({ result });
            if (result.status) {
                toast({
                    title: "Profile Update Success",
                    status: "success",
                    isClosable: true,
                    position: "top-right",
                });
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
        <Box
            bgColor="white"
            borderRadius="15px"
            padding="1.5rem"
            minH="80vh"
            boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid templateColumns="repeat(2,1fr)" gap="1rem 2rem">
                    <Box>
                        <Text
                            fontWeight="600"
                            fontSize="1.1rem"
                            mb="3rem"
                            textTransform="capitalize"
                            fontFamily="Open Sans"
                            color="brand.200"
                        >
                            Basic Info
                        </Text>
                        <Grid templateColumns="repeat(2,1fr)" gap="1rem 2rem">
                            <PrimaryInput<UpdateUserModel>
                                label="Organisation Name"
                                name="organizationName"
                                error={errors.organizationName}
                                placeholder=""
                                defaultValue={
                                    userProfile?.organizationName as string
                                }
                                register={register}
                            />
                            <InputBlank
                                label="Organisation Email"
                                placeholder=""
                                defaultValue={
                                    userProfile?.organizationEmail as string
                                }
                                disableLabel={true}
                            />
                            <PrimaryInput<UpdateUserModel>
                                label="Phone Number"
                                name="phoneNumber"
                                error={errors.organizationPhone}
                                placeholder=""
                                defaultValue={
                                    userProfile?.organizationPhone as string
                                }
                                register={register}
                            />
                            <SelectrixBox<UpdateUserModel>
                                control={control}
                                name="isActive"
                                error={errors.isActive}
                                keys="id"
                                keyLabel="label"
                                label="Profile Status"
                                placeholder={
                                    userProfile?.isActive === true
                                        ? "Active"
                                        : "Not Active"
                                }
                                options={[
                                    { id: "true", label: "Active" },
                                    { id: "false", label: "Not Active" },
                                ]}
                            />
                        </Grid>
                        <Box mt="1rem">
                            <PrimaryTextarea<UpdateUserModel>
                                label="Address"
                                name="organizationAddress"
                                error={errors.organizationAddress}
                                placeholder=""
                                defaultValue={
                                    userProfile?.organizationAddress || ""
                                }
                                register={register}
                            />
                        </Box>
                    </Box>
                    <Box>
                        <Text
                            fontWeight="600"
                            fontSize="1.1rem"
                            mb="3rem"
                            textTransform="capitalize"
                            fontFamily="Open Sans"
                            color="brand.200"
                        >
                            Contact Details
                        </Text>
                        <Grid templateColumns="repeat(2,1fr)" gap="1rem 2rem">
                            <PrimaryInput<UpdateUserModel>
                                label="Contact First Name"
                                name="firstName"
                                error={errors.firstName}
                                placeholder=""
                                defaultValue={userProfile?.firstName as string}
                                register={register}
                            />
                            <PrimaryInput<UpdateUserModel>
                                label="Contact Last Name"
                                name="lastName"
                                error={errors.lastName}
                                placeholder=""
                                defaultValue={userProfile?.lastName as string}
                                register={register}
                            />
                            <InputBlank
                                label="Conatct Email"
                                placeholder=""
                                defaultValue={userProfile?.email as string}
                                disableLabel={true}
                            />
                            <PrimaryInput<UpdateUserModel>
                                label="Contact Phone Number"
                                name="phoneNumber"
                                error={errors.phoneNumber}
                                placeholder=""
                                defaultValue={
                                    userProfile?.phoneNumber as string
                                }
                                register={register}
                            />
                        </Grid>
                    </Box>
                </Grid>
                <Grid templateColumns="repeat(2,1fr)" gap="1rem 2rem" my="2rem">
                    <Button
                        bgColor="gray.500"
                        color="white"
                        height="3rem"
                        fontSize="14px"
                        boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                        onClick={() => router.back()}
                    >
                        Back
                    </Button>
                    <Button
                        bgColor="brand.400"
                        color="white"
                        height="3rem"
                        fontSize="14px"
                        type="submit"
                        isLoading={isSubmitting}
                        boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                    >
                        <Box pr=".5rem">
                            <VscSaveAs />
                        </Box>
                        <Box>Update Profile</Box>
                    </Button>
                </Grid>
            </form>
        </Box>
    );
}

export default PaymentPartner;
