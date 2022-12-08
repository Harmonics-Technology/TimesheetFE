import { Box, Button, Circle, Grid, HStack, Text } from "@chakra-ui/react";
import React from "react";
import { FaUser } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CleaningModel } from "@interfaces/types";
import { VscSaveAs } from "react-icons/vsc";
import { PrimaryInput } from "@components/bits-utils/PrimaryInput";

const schema = yup.object().shape({
    buildingType: yup.string(),
    buildingState: yup.string(),
    propertyTypeId: yup.number().required(),
    dateNeeded: yup.string().required(),
    numberOfBathrooms: yup.string().required(),
    numberOfBedrooms: yup.string().required(),
    numberOfFloors: yup.string().required(),
});

function MyProfile() {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<CleaningModel>({
        resolver: yupResolver(schema),
        mode: "all",
    });
    const onSubmit = async (data: CleaningModel) => {
        // data.dateNeeded = new Date(
        //     data.dateNeeded as unknown as Date,
        // ).toLocaleDateString();
        // try {
        //     const result = await (await RequestCleaning(undefined, data)).data;
        //     if (result.status) {
        //         onClose();
        //         addToast("Job created sucessfully", {
        //             appearance: "success",
        //             autoDismiss: true,
        //         });
        //         router.reload();
        //         return;
        //     }
        //     onClose();
        //     addToast(result.message, {
        //         appearance: "error",
        //         autoDismiss: true,
        //     });
        //     return;
        // } catch (err) {}
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
                    >
                        <FaUser />
                    </Circle>
                    <Box>
                        <Text
                            fontSize=".8rem"
                            color="brand.300"
                            fontWeight="bold"
                        >
                            Super Admin Profile
                        </Text>
                        <Text fontSize=".8rem" color="brand.300" mb="0">
                            Oluwabukunmi Akinyemi
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
                            <PrimaryInput<CleaningModel>
                                label="No. of Bedrooms"
                                name="numberOfBedrooms"
                                error={errors.numberOfBedrooms}
                                placeholder=""
                                defaultValue=""
                                register={register}
                                h="2rem"
                            />
                            <PrimaryInput<CleaningModel>
                                label="No. of Bedrooms"
                                name="numberOfBedrooms"
                                error={errors.numberOfBedrooms}
                                placeholder=""
                                defaultValue=""
                                register={register}
                                h="2rem"
                            />
                            <PrimaryInput<CleaningModel>
                                label="No. of Bedrooms"
                                name="numberOfBedrooms"
                                error={errors.numberOfBedrooms}
                                placeholder=""
                                defaultValue=""
                                register={register}
                                h="2rem"
                            />
                            <PrimaryInput<CleaningModel>
                                label="No. of Bedrooms"
                                name="numberOfBedrooms"
                                error={errors.numberOfBedrooms}
                                placeholder=""
                                defaultValue=""
                                register={register}
                                h="2rem"
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
                            <PrimaryInput<CleaningModel>
                                label="No. of Bedrooms"
                                name="numberOfBedrooms"
                                error={errors.numberOfBedrooms}
                                placeholder=""
                                defaultValue=""
                                register={register}
                                h="2rem"
                            />
                            <PrimaryInput<CleaningModel>
                                label="No. of Bedrooms"
                                name="numberOfBedrooms"
                                error={errors.numberOfBedrooms}
                                placeholder=""
                                defaultValue=""
                                register={register}
                                h="2rem"
                            />
                            <PrimaryInput<CleaningModel>
                                label="No. of Bedrooms"
                                name="numberOfBedrooms"
                                error={errors.numberOfBedrooms}
                                placeholder=""
                                defaultValue=""
                                register={register}
                                h="2rem"
                            />
                            <PrimaryInput<CleaningModel>
                                label="No. of Bedrooms"
                                name="numberOfBedrooms"
                                error={errors.numberOfBedrooms}
                                placeholder=""
                                defaultValue=""
                                register={register}
                                h="2rem"
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
                            <PrimaryInput<CleaningModel>
                                label="No. of Bedrooms"
                                name="numberOfBedrooms"
                                error={errors.numberOfBedrooms}
                                placeholder=""
                                defaultValue=""
                                register={register}
                                h="2rem"
                            />
                            <PrimaryInput<CleaningModel>
                                label="No. of Bedrooms"
                                name="numberOfBedrooms"
                                error={errors.numberOfBedrooms}
                                placeholder=""
                                defaultValue=""
                                register={register}
                                h="2rem"
                            />
                            <PrimaryInput<CleaningModel>
                                label="No. of Bedrooms"
                                name="numberOfBedrooms"
                                error={errors.numberOfBedrooms}
                                placeholder=""
                                defaultValue=""
                                register={register}
                                h="2rem"
                            />
                            <PrimaryInput<CleaningModel>
                                label="No. of Bedrooms"
                                name="numberOfBedrooms"
                                error={errors.numberOfBedrooms}
                                placeholder=""
                                defaultValue=""
                                register={register}
                                h="2rem"
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
