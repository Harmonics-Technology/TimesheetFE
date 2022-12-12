import { Box, Button, Flex, Grid, Text, useToast } from "@chakra-ui/react";
import { PrimaryInput } from "@components/bits-utils/PrimaryInput";
import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { VscSaveAs } from "react-icons/vsc";
import {
    ContractViewPagedCollectionStandardResponse,
    TeamMemberModel,
    UserService,
    UserView,
} from "src/services";
import InputBlank from "@components/bits-utils/InputBlank";
import { useRouter } from "next/router";
import { PrimaryPhoneInput } from "@components/bits-utils/PrimaryPhoneInput";
import { SelectrixBox } from "@components/bits-utils/Selectrix";
import { PrimaryDate } from "@components/bits-utils/PrimaryDate";
import { PrimaryRadio } from "@components/bits-utils/PrimaryRadio";
import ContractTable from "@components/bits-utils/ContractTable";
import { DateObject } from "react-multi-date-picker";

const schema = yup.object().shape({});
interface TeamProfileProps {
    userProfile?: UserView;
    clients: UserView[];
    supervisor: UserView[];
    paymentPartner: UserView[];
    contractList: ContractViewPagedCollectionStandardResponse;
}

function TeamProfile({
    userProfile,
    clients,
    supervisor,
    paymentPartner,
    contractList,
}: TeamProfileProps) {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<TeamMemberModel>({
        resolver: yupResolver(schema),
        mode: "all",
        defaultValues: {
            isActive: userProfile?.isActive,
            phoneNumber: userProfile?.phoneNumber,
        },
    });
    const router = useRouter();
    const toast = useToast();
    console.log({ userProfile });

    const onSubmit = async (data: TeamMemberModel) => {
        data.isActive = data.isActive === ("true" as unknown as boolean);
        console.log({ data });

        try {
            const result = await UserService.updateTeamMember(data);
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
                <Grid
                    templateColumns={["repeat(1,1fr)", "repeat(3,1fr)"]}
                    gap="1rem 2rem"
                >
                    <PrimaryInput<TeamMemberModel>
                        label="First Name"
                        name="firstName"
                        error={errors.firstName}
                        placeholder=""
                        defaultValue={userProfile?.firstName as string}
                        register={register}
                    />
                    <PrimaryInput<TeamMemberModel>
                        label="Last Name"
                        name="lastName"
                        error={errors.lastName}
                        placeholder=""
                        defaultValue={userProfile?.lastName as string}
                        register={register}
                    />
                    <InputBlank
                        label="Email"
                        placeholder=""
                        defaultValue={userProfile?.email as string}
                        disableLabel={true}
                    />
                    <PrimaryPhoneInput<TeamMemberModel>
                        label="Phone Number"
                        name="phoneNumber"
                        error={errors.phoneNumber}
                        placeholder={userProfile?.phoneNumber as string}
                        control={control}
                    />
                    <PrimaryInput<TeamMemberModel>
                        label="Job Title"
                        name="jobTitle"
                        error={errors.jobTitle}
                        placeholder=""
                        defaultValue={
                            userProfile?.employeeInformation?.jobTitle as string
                        }
                        register={register}
                    />
                    <PrimaryDate<TeamMemberModel>
                        control={control}
                        name="dateOfBirth"
                        label="Date of Birth"
                        error={errors.dateOfBirth}
                        placeholder={userProfile?.email as string}
                        max={new DateObject().subtract(1, "days")}
                    />
                    <SelectrixBox<TeamMemberModel>
                        control={control}
                        name="clientId"
                        error={errors.clientId}
                        keys="id"
                        keyLabel="fullName"
                        label="Current Client"
                        placeholder={
                            userProfile?.employeeInformation?.client
                                ?.fullName as string
                        }
                        options={clients}
                    />
                    <SelectrixBox<TeamMemberModel>
                        control={control}
                        name="supervisorId"
                        error={errors.supervisorId}
                        keys="id"
                        keyLabel="fullName"
                        label="Supervisor"
                        placeholder={
                            userProfile?.employeeInformation?.supervisor
                                ?.fullName as string
                        }
                        options={supervisor}
                    />
                    <SelectrixBox<TeamMemberModel>
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
                <Box w="full">
                    <Flex
                        justify="space-between"
                        align="center"
                        my="1rem"
                        py="1rem"
                        borderY="1px solid"
                        borderColor="gray.300"
                    >
                        <Text
                            textTransform="uppercase"
                            mb="0"
                            fontSize="1.3rem"
                            fontWeight="500"
                        >
                            Work Data
                        </Text>
                    </Flex>
                    <Grid
                        templateColumns={["repeat(1,1fr)", "repeat(3,1fr)"]}
                        gap="1rem 2rem"
                    >
                        <SelectrixBox<TeamMemberModel>
                            control={control}
                            name="payRollTypeId"
                            error={errors.payRollTypeId}
                            keys="id"
                            keyLabel="label"
                            label="Payroll Type"
                            placeholder={
                                (userProfile?.employeeInformation
                                    ?.payrollType as string) || "Please Select"
                            }
                            options={[
                                {
                                    id: "1",
                                    label: "Onshore Contract",
                                },
                                {
                                    id: "2",
                                    label: "Offshore contract",
                                },
                            ]}
                        />
                        <PrimaryInput<TeamMemberModel>
                            label="Hr/Day"
                            name="hoursPerDay"
                            error={errors.hoursPerDay}
                            placeholder=""
                            defaultValue={userProfile?.email as string}
                            register={register}
                        />

                        <SelectrixBox<TeamMemberModel>
                            control={control}
                            name="paymentPartnerId"
                            error={errors.paymentPartnerId}
                            keys="id"
                            keyLabel="fullName"
                            label="Payment Partner"
                            options={paymentPartner}
                            placeholder={
                                userProfile?.employeeInformation?.paymentPartner
                                    ?.fullName as string
                            }
                        />
                        <PrimaryInput<TeamMemberModel>
                            label="Client Rate"
                            name="ratePerHour"
                            error={errors.ratePerHour}
                            placeholder=""
                            defaultValue={
                                userProfile?.employeeInformation
                                    ?.ratePerHour as unknown as string
                            }
                            register={register}
                        />
                        <SelectrixBox<TeamMemberModel>
                            control={control}
                            name="currency"
                            error={errors.currency}
                            keys="id"
                            keyLabel="label"
                            label="Currency"
                            placeholder={
                                userProfile?.employeeInformation
                                    ?.currency as string
                            }
                            options={[
                                { id: "CAD", label: "CAD" },
                                { id: "NGN", label: "NGN" },
                            ]}
                        />
                        <SelectrixBox<TeamMemberModel>
                            control={control}
                            name="paymentRate"
                            error={errors.paymentRate}
                            keys="id"
                            keyLabel="label"
                            label="Payment Frequency"
                            placeholder={
                                userProfile?.employeeInformation
                                    ?.paymentRate as string
                            }
                            options={[
                                { id: "weekly", label: "Weekly" },
                                { id: "bi-weekly", label: "Bi-Weekly" },
                                { id: "monthly", label: "Monthly" },
                            ]}
                        />
                    </Grid>
                    <Box my=".8rem">
                        <PrimaryRadio<TeamMemberModel>
                            name="fixedAmount"
                            control={control}
                            error={errors.fixedAmount}
                            value={
                                userProfile?.employeeInformation?.fixedAmount ==
                                true
                                    ? "true"
                                    : "false"
                            }
                            radios={[
                                { label: "Fixed amount", val: "true" },
                                { label: "Percentage", val: "false" },
                            ]}
                        />
                    </Box>
                </Box>
                <ContractTable
                    userProfile={userProfile}
                    adminList={contractList}
                />
                <Grid
                    templateColumns={["repeat(2,1fr)", "repeat(2,1fr)"]}
                    gap="1rem 2rem"
                    my="2rem"
                >
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

export default TeamProfile;
