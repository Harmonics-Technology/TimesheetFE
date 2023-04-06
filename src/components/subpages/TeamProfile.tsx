import {
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Grid,
    HStack,
    Select,
    Spinner,
    Text,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { VscSaveAs } from 'react-icons/vsc';
import {
    ContractViewPagedCollectionStandardResponse,
    TeamMemberModel,
    UserService,
    UserView,
} from 'src/services';
import InputBlank from '@components/bits-utils/InputBlank';
import { useRouter } from 'next/router';
import { PrimaryPhoneInput } from '@components/bits-utils/PrimaryPhoneInput';
import { SelectrixBox } from '@components/bits-utils/Selectrix';
import { PrimaryDate } from '@components/bits-utils/PrimaryDate';
import { PrimaryRadio } from '@components/bits-utils/PrimaryRadio';
import ContractTable from '@components/bits-utils/ContractTable';
import { DateObject } from 'react-multi-date-picker';
import moment from 'moment';
import { Widget } from '@uploadcare/react-widget';
import { AiOutlineDownload } from 'react-icons/ai';
import axios from 'axios';
import fileDownload from 'js-file-download';
import BeatLoader from 'react-spinners/BeatLoader';
import UploadCareWidget from '@components/bits-utils/UploadCareWidget';
import { OnboardingFeeContext } from '@components/context/OnboardingFeeContext';
import dynamic from 'next/dynamic';
import ConfirmChangeModal from '@components/bits-utils/ConfirmChangeModal';
import { formatDate } from '@components/generics/functions/formatDate';
import { useLeavePageConfirmation } from '@components/generics/useLeavePageConfirmation';
import { keys } from 'mobx';
import error from 'next/error';
import { UserContext } from '@components/context/UserContext';

interface select {
    options: any;
    customKeys: { key: string | number | boolean; label: string };
    onChange: (value: any) => void;
    placeholder?: string;
    disabled?: boolean;
    searchable?: boolean;
}
const Selectrix = dynamic<select>(() => import('react-selectrix'), {
    ssr: false,
});
const schema = yup.object().shape({});
interface TeamProfileProps {
    userProfile?: UserView;
    // clients: UserView[];
    supervisor: UserView[];
    paymentPartner: UserView[];
}

function TeamProfile({
    userProfile,
    // clients,
    supervisor,
    paymentPartner,
}: TeamProfileProps) {
    console.log({ userProfile });

    const { user } = useContext(UserContext);
    console.log({ user });
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        getValues,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<TeamMemberModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            role: userProfile?.role as unknown as string,
            isActive: userProfile?.isActive,
            phoneNumber: userProfile?.phoneNumber,
            email: userProfile?.email,
            dateOfBirth: userProfile?.dateOfBirth,
            clientId: userProfile?.employeeInformation?.clientId,
            supervisorId: userProfile?.employeeInformation?.supervisorId,
            paymentPartnerId:
                userProfile?.employeeInformation?.paymentPartnerId,
            currency: userProfile?.employeeInformation?.currency,
            paymentRate: userProfile?.employeeInformation?.paymentRate,
            insuranceDocumentUrl:
                userProfile?.employeeInformation?.insuranceDocumentUrl,
            voidCheckUrl: userProfile?.employeeInformation?.voidCheckUrl,
            inCorporationDocumentUrl:
                userProfile?.employeeInformation?.inCorporationDocumentUrl,
            paymentFrequency:
                userProfile?.employeeInformation?.paymentFrequency,
            fixedAmount: userProfile?.employeeInformation?.fixedAmount,
            onBordingFee: userProfile?.employeeInformation?.onBoradingFee,
            monthlyPayoutRate:
                userProfile?.employeeInformation?.monthlyPayoutRate,
            payrollGroupId: userProfile?.employeeInformation?.payrollGroupId,
        },
    });
    const router = useRouter();
    const toast = useToast();
    // console.log(watch('role'));
    const payroll = userProfile?.employeeInformation?.payrollType;
    const payrolls = watch('payRollTypeId');
    const onboarding = watch('fixedAmount');

    const [icd, setIcd] = useState<any>('');
    const [voidCheck, setVoidCheck] = useState<any>('');
    const [inc, setInc] = useState<any>('');
    const [showLoadingB, setShowLoadingB] = useState(false);
    const [showLoadingC, setShowLoadingC] = useState(false);
    const [showLoadingD, setShowLoadingD] = useState(false);
    const widgetApiB = useRef<any>();
    const widgetApiC = useRef<any>();
    const widgetApiD = useRef<any>();

    const showLoadingStateB = (file) => {
        if (file) {
            file.progress((info) => {
                console.log('File progress: ', info.progress),
                    setShowLoadingB(true);
            });
            file.done((info) => {
                setShowLoadingB(false),
                    console.log('File uploaded: ', info),
                    setIcd(info);
            });
        }
    };
    const showLoadingStateC = (file) => {
        if (file) {
            file.progress((info) => {
                console.log('File progress: ', info.progress),
                    setShowLoadingC(true);
            });
            file.done((info) => {
                setShowLoadingC(false),
                    console.log('File uploaded: ', info),
                    setVoidCheck(info);
            });
        }
    };
    const showLoadingStateD = (file) => {
        if (file) {
            file.progress((info) => {
                console.log('File progress: ', info.progress),
                    setShowLoadingD(true);
            });
            file.done((info) => {
                setShowLoadingD(false),
                    console.log('File uploaded: ', info),
                    setInc(info);
            });
        }
    };

    const downloadFile = (url: any) => {
        console.log(url);
        axios
            .get(url, {
                responseType: 'blob',
            })
            .then((res) => {
                fileDownload(res.data, `${url.split(' ').pop()}`);
            });
    };
    const { fixedAmount, percentageAmount } = useContext(OnboardingFeeContext);
    const percentageAmounts = percentageAmount?.sort(
        (a, b) => (a.fee as number) - (b.fee as number),
    );
    // console.log({ percentageAmounts });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selected, setSelected] = useState(userProfile?.role as string);
    const changeUserRole = async (val) => {
        setSelected(val);
        onOpen();
    };
    const onSubmit = async (data: TeamMemberModel) => {
        // data.isActive = data.isActive === ('true' as unknown as boolean);

        data.payrollGroupId == 0
            ? (data.payrollGroupId = null)
            : data.payrollGroupId;

        if (data.fixedAmount == true) {
            data.onBordingFee = fixedAmount;
        }
        if (icd !== '') {
            data.inCorporationDocumentUrl = `${icd.cdnUrl} ${icd.name}`;
        }
        if (voidCheck !== '') {
            data.voidCheckUrl = `${voidCheck.cdnUrl} ${voidCheck.name}`;
        }
        if (inc !== '') {
            data.insuranceDocumentUrl = `${inc.cdnUrl} ${inc.name}`;
        }
        // data.clientId = userProfile?.employeeInformation?.client?.id;
        console.log({ data });

        try {
            const result = await UserService.updateTeamMember(data);
            // console.log({ result });
            if (result.status) {
                toast({
                    title: 'Profile Update Success',
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.reload();
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (error) {
            console.log(error);
            toast({
                title: `Check your network connection and try again`,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const show = router.asPath.startsWith('/clients/team-members');
    // console.log({ isDirty });

    useLeavePageConfirmation(isDirty && !isSubmitting);
    return (
        <Box
            bgColor="white"
            borderRadius="15px"
            padding="1.5rem"
            minH="80vh"
            boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
        >
            <form>
                <Grid
                    templateColumns={['repeat(1,1fr)', 'repeat(3,1fr)']}
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
                    <PrimaryDate<TeamMemberModel>
                        control={control}
                        name="dateOfBirth"
                        label="Date of Birth"
                        error={errors.dateOfBirth}
                        defaultValue={moment(userProfile?.dateOfBirth).format(
                            'DD MM YYYY',
                        )}
                        max={new DateObject().subtract(1, 'days')}
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
                                ? 'Active'
                                : 'Not Active'
                        }
                        options={[
                            { id: 'true', label: 'Active' },
                            { id: 'false', label: 'Not Active' },
                        ]}
                    />
                </Grid>
                <Box mt="1rem">
                    <PrimaryInput<TeamMemberModel>
                        label="Address"
                        name="address"
                        error={errors.address}
                        placeholder=""
                        defaultValue={userProfile?.address as string}
                        register={register}
                    />
                </Box>
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
                        templateColumns={['repeat(1,1fr)', 'repeat(3,1fr)']}
                        gap="1rem 2rem"
                    >
                        <PrimaryInput<TeamMemberModel>
                            label="Job Title"
                            name="jobTitle"
                            error={errors.jobTitle}
                            placeholder=""
                            defaultValue={
                                userProfile?.employeeInformation
                                    ?.jobTitle as string
                            }
                            register={register}
                        />
                        <SelectrixBox<TeamMemberModel>
                            control={control}
                            name="clientId"
                            error={errors.clientId}
                            keys="id"
                            keyLabel="fullName"
                            label="Current Client"
                            disabled
                            placeholder={
                                userProfile?.clientName ||
                                (userProfile?.employeeInformation?.supervisor
                                    ?.clientName as string)
                            }
                            options={[]}
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
                            name="role"
                            error={errors.role}
                            keys="id"
                            keyLabel="label"
                            label="Role"
                            // disabled={true}
                            placeholder={userProfile?.role as string}
                            customOnchange={(value) =>
                                changeUserRole(value.key)
                            }
                            renderSelection={getValues('role')}
                            options={[
                                { id: 'Team Member', label: 'Team Member' },
                                {
                                    id: 'Internal Supervisor',
                                    label: 'Internal Supervisor',
                                },
                                {
                                    id: 'Internal Admin',
                                    label: 'Internal Admin',
                                },
                                {
                                    id: 'Internal Payroll Manager',
                                    label: 'Internal Payroll Manager',
                                },
                            ]}
                        />

                        <SelectrixBox<TeamMemberModel>
                            control={control}
                            name="payRollTypeId"
                            error={errors.payRollTypeId}
                            keys="id"
                            keyLabel="label"
                            label="Payroll Type"
                            disabled={true}
                            placeholder={
                                (userProfile?.employeeInformation
                                    ?.payrollType as string) || 'Please Select'
                            }
                            options={[
                                {
                                    id: '1',
                                    label: 'Onshore Contract',
                                },
                                {
                                    id: '2',
                                    label: 'Offshore contract',
                                },
                            ]}
                        />
                        {(payroll == 'ONSHORE' && payrolls == undefined) ||
                        payroll == 'ONSHORE' ||
                        payrolls == 1 ? (
                            <>
                                <PrimaryInput<TeamMemberModel>
                                    label="Rate/Hr"
                                    name="ratePerHour"
                                    error={errors.ratePerHour}
                                    placeholder=""
                                    defaultValue={
                                        userProfile?.employeeInformation
                                            ?.ratePerHour as unknown as string
                                    }
                                    register={register}
                                />
                                <PrimaryInput<TeamMemberModel>
                                    label="Hr/Day"
                                    name="hoursPerDay"
                                    error={errors.hoursPerDay}
                                    placeholder=""
                                    defaultValue={
                                        userProfile?.employeeInformation
                                            ?.hoursPerDay as unknown as string
                                    }
                                    register={register}
                                />
                                <Box>
                                    <Flex>
                                        <FormLabel
                                            textTransform="capitalize"
                                            width="fit-content"
                                            fontSize=".8rem"
                                        >
                                            Incorporation Document
                                        </FormLabel>
                                        <Box
                                            cursor="pointer"
                                            onClick={() =>
                                                downloadFile(
                                                    userProfile
                                                        ?.employeeInformation
                                                        ?.inCorporationDocumentUrl,
                                                )
                                            }
                                        >
                                            <AiOutlineDownload />
                                        </Box>
                                    </Flex>

                                    <UploadCareWidget
                                        refs={widgetApiB}
                                        label=""
                                        filename={icd?.name}
                                        loading={showLoadingB}
                                        uploadFunction={showLoadingStateB}
                                    />
                                </Box>
                                <Box>
                                    <Flex>
                                        <FormLabel
                                            textTransform="capitalize"
                                            width="fit-content"
                                            fontSize=".8rem"
                                        >
                                            Void Check
                                        </FormLabel>
                                        <Box
                                            cursor="pointer"
                                            onClick={() =>
                                                downloadFile(
                                                    userProfile
                                                        ?.employeeInformation
                                                        ?.voidCheckUrl,
                                                )
                                            }
                                        >
                                            <AiOutlineDownload />
                                        </Box>
                                    </Flex>

                                    <UploadCareWidget
                                        refs={widgetApiC}
                                        label=""
                                        filename={voidCheck?.name}
                                        loading={showLoadingC}
                                        uploadFunction={showLoadingStateC}
                                    />
                                </Box>
                                <Box>
                                    <Flex>
                                        <FormLabel
                                            textTransform="capitalize"
                                            width="fit-content"
                                            fontSize=".8rem"
                                        >
                                            Issuance Certificate
                                        </FormLabel>
                                        <Box
                                            cursor="pointer"
                                            onClick={() =>
                                                downloadFile(
                                                    userProfile
                                                        ?.employeeInformation
                                                        ?.insuranceDocumentUrl,
                                                )
                                            }
                                        >
                                            <AiOutlineDownload />
                                        </Box>
                                    </Flex>

                                    <UploadCareWidget
                                        refs={widgetApiD}
                                        label=""
                                        filename={inc?.name}
                                        loading={showLoadingD}
                                        uploadFunction={showLoadingStateD}
                                    />
                                </Box>

                                <PrimaryInput<TeamMemberModel>
                                    label="HST No."
                                    name="hstNumber"
                                    error={errors.hstNumber}
                                    placeholder=""
                                    defaultValue={
                                        userProfile?.employeeInformation
                                            ?.hstNumber as unknown as string
                                    }
                                    register={register}
                                />
                            </>
                        ) : (
                            <>
                                <PrimaryInput<TeamMemberModel>
                                    label="Monthly Payout"
                                    name="monthlyPayoutRate"
                                    error={errors.monthlyPayoutRate}
                                    placeholder=""
                                    defaultValue={
                                        userProfile?.employeeInformation
                                            ?.monthlyPayoutRate as unknown as string
                                    }
                                    register={register}
                                />
                                <PrimaryInput<TeamMemberModel>
                                    label="Hr/Day"
                                    name="hoursPerDay"
                                    error={errors.hoursPerDay}
                                    placeholder=""
                                    defaultValue={
                                        userProfile?.employeeInformation
                                            ?.hoursPerDay as unknown as string
                                    }
                                    register={register}
                                />
                                <SelectrixBox<TeamMemberModel>
                                    control={control}
                                    name="paymentPartnerId"
                                    error={errors.paymentPartnerId}
                                    keys="id"
                                    keyLabel="firstName"
                                    label="Payment Partner"
                                    options={paymentPartner}
                                    placeholder={
                                        userProfile?.employeeInformation
                                            ?.paymentPartner
                                            ?.firstName as string
                                    }
                                />
                                <SelectrixBox<TeamMemberModel>
                                    control={control}
                                    name="payrollGroupId"
                                    error={errors.payrollGroupId}
                                    keys="id"
                                    keyLabel="label"
                                    label="Payroll Group"
                                    placeholder={
                                        userProfile?.employeeInformation
                                            ?.payrollGroup || 'Please select'
                                    }
                                    options={[
                                        {
                                            id: 1,
                                            label: 'Pro-insight Technology',
                                        },
                                        {
                                            id: 2,
                                            label: 'Olade consulting',
                                        },
                                    ]}
                                />
                            </>
                        )}
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
                                { id: 'CAD', label: 'CAD' },
                                { id: 'NGN', label: 'NGN' },
                            ]}
                        />
                        <SelectrixBox<TeamMemberModel>
                            control={control}
                            name="paymentFrequency"
                            error={errors.paymentFrequency}
                            keys="id"
                            keyLabel="label"
                            label="Payment Frequency"
                            options={[
                                { id: 'Weekly', label: 'Weekly' },
                                { id: 'Bi-weekly', label: 'Bi-Weekly' },
                                { id: 'Monthly', label: 'Monthly' },
                            ]}
                            placeholder={
                                (userProfile?.employeeInformation
                                    ?.paymentFrequency as string) ||
                                'Please select'
                            }
                        />
                        <SelectrixBox<TeamMemberModel>
                            control={control}
                            name="fixedAmount"
                            error={errors.fixedAmount}
                            keys="id"
                            keyLabel="label"
                            label="Onboarding fee type"
                            placeholder={
                                userProfile?.employeeInformation?.fixedAmount ==
                                true
                                    ? 'Fixed Amount'
                                    : 'Percentage'
                            }
                            options={[
                                { id: true, label: 'Fixed amount' },
                                { id: false, label: 'Percentage' },
                            ]}
                        />
                        {userProfile?.employeeInformation?.fixedAmount ==
                            false || onboarding == false ? (
                            <SelectrixBox<TeamMemberModel>
                                control={control}
                                name="onBordingFee"
                                error={errors.onBordingFee}
                                keys="fee"
                                keyLabel="fee"
                                label="Onboarding fee"
                                placeholder={
                                    userProfile?.employeeInformation
                                        ?.onBoradingFee as unknown as string
                                }
                                options={percentageAmounts}
                            />
                        ) : (
                            // : onboarding == true &&
                            //   fixedAmount !== undefined ? (
                            //     <Box pos="relative">
                            //         <PrimaryInput<TeamMemberModel>
                            //             label="Onboarding fee"
                            //             name="onBordingFee"
                            //             error={errors.onBordingFee}
                            //             placeholder=""
                            //             value={fixedAmount}
                            //             register={register}
                            //             readonly
                            //         />
                            //         <Text
                            //             pos="absolute"
                            //             mb="0"
                            //             left="8%"
                            //             top="50%"
                            //             transform="translateY(-15%)"
                            //             bgColor="white"
                            //         >
                            //             {fixedAmount}
                            //         </Text>
                            //     </Box>
                            // )
                            ''
                        )}
                    </Grid>
                </Box>
                <ContractTable userProfile={userProfile} />
            </form>
            <HStack
                flexDir={['column', 'row']}
                spacing={0}
                gap="1rem 2rem"
                my="2rem"
            >
                <Button
                    bgColor="gray.500"
                    color="white"
                    height="3rem"
                    fontSize="14px"
                    w="full"
                    boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                    onClick={() => router.back()}
                >
                    Back
                </Button>
                {!show && (
                    <Button
                        bgColor="brand.400"
                        color="white"
                        height="3rem"
                        fontSize="14px"
                        w="full"
                        // type="submit"
                        onClick={handleSubmit(onSubmit)}
                        isLoading={isSubmitting}
                        spinner={<BeatLoader color="white" size={10} />}
                        boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                    >
                        <Box pr=".5rem">
                            <VscSaveAs />
                        </Box>
                        <Box>Update Profile</Box>
                    </Button>
                )}
            </HStack>
            <ConfirmChangeModal
                isOpen={isOpen}
                onClose={onClose}
                selected={selected}
                setValue={setValue}
            />
        </Box>
    );
}

export default TeamProfile;
