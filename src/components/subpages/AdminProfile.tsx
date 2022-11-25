import { Box, Button, Grid, Text } from "@chakra-ui/react";
import { PrimaryInput } from "@components/bits-utils/PrimaryInput";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CleaningModel } from "@interfaces/types";
import { VscSaveAs } from "react-icons/vsc";

const schema = yup.object().shape({
    buildingType: yup.string(),
    buildingState: yup.string(),
    propertyTypeId: yup.number().required(),
    dateNeeded: yup.string().required(),
    numberOfBathrooms: yup.string().required(),
    numberOfBedrooms: yup.string().required(),
    numberOfFloors: yup.string().required(),
});

function AdminProfile() {
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
        <Box
            bgColor="white"
            borderRadius="15px"
            padding="1.5rem"
            minH="80vh"
            boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
        >
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
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid templateColumns="repeat(2,1fr)" gap="1rem 2rem">
                    <PrimaryInput<CleaningModel>
                        label="No. of Bedrooms"
                        name="numberOfBedrooms"
                        error={errors.numberOfBedrooms}
                        placeholder=""
                        defaultValue=""
                        register={register}
                    />
                    <PrimaryInput<CleaningModel>
                        label="No. of Bedrooms"
                        name="numberOfBedrooms"
                        error={errors.numberOfBedrooms}
                        placeholder=""
                        defaultValue=""
                        register={register}
                    />
                    <PrimaryInput<CleaningModel>
                        label="No. of Bedrooms"
                        name="numberOfBedrooms"
                        error={errors.numberOfBedrooms}
                        placeholder=""
                        defaultValue=""
                        register={register}
                    />
                    <PrimaryInput<CleaningModel>
                        label="No. of Bedrooms"
                        name="numberOfBedrooms"
                        error={errors.numberOfBedrooms}
                        placeholder=""
                        defaultValue=""
                        register={register}
                    />
                    <PrimaryInput<CleaningModel>
                        label="No. of Bedrooms"
                        name="numberOfBedrooms"
                        error={errors.numberOfBedrooms}
                        placeholder=""
                        defaultValue=""
                        register={register}
                    />
                </Grid>
                <Grid templateColumns="repeat(2,1fr)" gap="1rem 2rem" my="2rem">
                    <Button
                        bgColor="brand.400"
                        color="white"
                        height="3rem"
                        fontSize="14px"
                        boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                    >
                        <Box pr=".5rem">
                            <VscSaveAs />
                        </Box>
                        <Box>Update Profile</Box>
                    </Button>
                    <Button
                        bgColor="gray.500"
                        color="white"
                        height="3rem"
                        fontSize="14px"
                        boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                    >
                        Back
                    </Button>
                </Grid>
            </form>
        </Box>
    );
}

export default AdminProfile;
