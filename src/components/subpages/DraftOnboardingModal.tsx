import {
    Box,
    Button,
    Flex,
    Text,
    Grid,
    DrawerFooter,
    useToast,
    HStack,
    useRadioGroup,
    useDisclosure,
} from '@chakra-ui/react';
import DrawerWrapper from '@components/bits-utils/Drawer';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RiMailSendFill } from 'react-icons/ri';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
interface adminProps {
    isOpen: boolean;
    onClose: any;
    data: UserDraftView | undefined;
    clients: UserView[];
    paymentPartner: UserView[];
    leaveSettings: LeaveConfigurationView;
    isSuperAdmin?: boolean;
}

import {
    LeaveConfigurationView,
    TeamMemberModel,
    UserDraftView,
    UserDraftModel,
    UserService,
    UserView,
    DraftService,
} from 'src/services';
import { useRouter } from 'next/router';
import { PrimaryPhoneInput } from '@components/bits-utils/PrimaryPhoneInput';
import { PrimaryDate } from '@components/bits-utils/PrimaryDate';
import { SelectrixBox } from '@components/bits-utils/Selectrix';
import { DateObject } from 'react-multi-date-picker';
import Loading from '@components/bits-utils/Loading';
import BeatLoader from 'react-spinners/BeatLoader';
import UploadCareWidget from '@components/bits-utils/UploadCareWidget';
import { OnboardingFeeContext } from '@components/context/OnboardingFeeContext';
import { PrimaryRadio } from '@components/bits-utils/PrimaryRadio';
import { UserContext } from '@components/context/UserContext';
import RadioBtn from '@components/bits-utils/RadioBtn';
import { TriggerBox } from '@components/bits-utils/TriggerBox';
import Cookies from 'js-cookie';
import { ShowPrompt } from '@components/bits-utils/ProjectManagement/Modals/ShowPrompt';
import moment from 'moment';
const schema = yup.object().shape({
    lastName: yup.string().required(),
    firstName: yup.string().required(),
    email: yup.string().email().required(),
    phoneNumber: yup.string().required(),
    jobTitle: yup.string().required(),
    // clientId: yup.string().required(),
    supervisorId: yup.string().required(),
    isActive: yup.boolean().required(),
    hoursPerDay: yup.number().required(),
    payRollTypeId: yup.number().when('enableFinancials', {
        is: true,
        then: yup.number().required(),
    }),
    paymentPartnerId: yup.string().when('enableFinancials', {
        is: true,
        then: yup.string().nullable().when('payRollTypeId', {
            is: 2,
            then: yup.string().required(),
        }),
    }),
    ratePerHour: yup.string().when('enableFinancials', {
        is: true,
        then: yup.string().nullable().when('payRollTypeId', {
            is: 1,
            then: yup.string().required(),
        }),
    }),
    hstNumber: yup.number().when('enableFinancials', {
        is: true,
        then: yup.number().nullable().when('payRollTypeId', {
            is: 1,
            then: yup.number().required(),
        }),
    }),
    monthlyPayoutRate: yup.string().when('enableFinancials', {
        is: true,
        then: yup.string().nullable().when('payRollTypeId', {
            is: 2,
            then: yup.string().required(),
        }),
    }),
    currency: yup.string().required(),
    // paymentRate: yup.string().required(),
    fixedAmount: yup.boolean().when('enableFinancials', {
        is: true,
        then: yup.boolean().required(),
    }),
    title: yup.string().required(),
    startDate: yup.string().required(),
    endDate: yup.string().required(),
    dateOfBirth: yup.string().required(),
    paymentFrequency: yup.string().required(),
    address: yup.string().required(),
    clientRate: yup.string().when('enableFinancials', {
        is: true,
        then: yup.string().required(),
    }),
    // timeSheetGenerationStartDate: yup.string().required(),
    isEligibleForLeave: yup.string().required(),
    employeeType: yup.string().required(),
    numberOfDaysEligible: yup.string().when('isEligibleForLeave', {
        is: 'Yes',
        then: yup.string().required(),
    }),
    numberOfHoursEligible: yup.string().when('isEligibleForLeave', {
        is: 'Yes',
        then: yup.string().required(),
    }),
    onBoradingFee: yup.string().when('fixedAmount', {
        is: false,
        then: yup.string().required(),
    }),
});

function DraftOnboardingModal({
    isOpen,
    onClose,
    data,
    clients,
    paymentPartner,
    leaveSettings,
}: adminProps) {
    const client = clients?.filter((x) => x.isActive);
    //
    const [openDraft, setOpenDraft] = useState<boolean>(false);
    const draftSchema = yup.object().shape({});
    const { fixedAmount, percentageAmount } = useContext(OnboardingFeeContext);

    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TeamMemberModel>({
        resolver: yupResolver(openDraft ? draftSchema : schema),
        mode: 'all',
        // defaultValues: {

        // },
    });
    //
    // console.log({ errors });
    // const { isOpen: opened, onOpen: opens, onClose: closed } = useDisclosure();
    const { user, opens, subType } = useContext(UserContext);
    const router = useRouter();
    const toast = useToast();
    const payroll = watch('payRollTypeId');
    const currency = watch('currency');
    //

    //
    const onboarding = watch('fixedAmount');
    const clientId = watch('clientId');
    const isEligibleForLeave = watch('isEligibleForLeave');
    const includePayroll = watch('enableFinancials');

    const [contract, setContractFile] = useState<any>('');
    const [icd, setIcd] = useState<any>('');
    const [voidCheck, setVoidCheck] = useState<any>('');
    const [inc, setInc] = useState<any>('');
    const [showLoading, setShowLoading] = useState(false);
    const [showLoadingB, setShowLoadingB] = useState(false);
    const [showLoadingC, setShowLoadingC] = useState(false);
    const [showLoadingD, setShowLoadingD] = useState(false);
    const widgetApi = useRef<any>();
    const widgetApiB = useRef<any>();
    const widgetApiC = useRef<any>();
    const widgetApiD = useRef<any>();

    // const resetOnClose = () => {

    // }

    const showLoadingStateB = (file) => {
        if (file) {
            file.progress((info) => {
                setShowLoadingB(true);
            });
            file.done((info) => {
                setShowLoadingB(false), setIcd(info);
            });
        }
    };
    const showLoadingStateC = (file) => {
        if (file) {
            file.progress((info) => {
                setShowLoadingC(true);
            });
            file.done((info) => {
                setShowLoadingC(false), setVoidCheck(info);
            });
        }
    };
    const showLoadingStateD = (file) => {
        if (file) {
            file.progress((info) => {
                setShowLoadingD(true);
            });
            file.done((info) => {
                setShowLoadingD(false), setInc(info);
            });
        }
    };
    const showLoadingState = (file) => {
        if (file) {
            file.progress((info) => {
                setShowLoading(true);
            });
            file.done((info) => {
                setShowLoading(false), setContractFile(info);
            });
        }
    };
    showLoading && showLoadingState;

    const [supervisors, setSupervisors] = useState<any>();
    const [loading, setLoading] = useState<any>();

    const getSupervisor = async (id) => {
        if (id === undefined) {
            return;
        }
        setLoading(true);

        try {
            const data = await UserService.getSupervisors(id);
            setLoading(false);

            if (data.status) {
                setSupervisors(data.data?.filter((x) => x.isActive));
                return;
            }
            setLoading(false);
        } catch (err: any) {
            setLoading(false);
            toast({
                title: err?.body?.message || err.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    //

    useEffect(() => {
        getSupervisor(clientId);
    }, [clientId]);

    //
    const [clientType, setClientType] = useState(false);
    const draftId = data?.id;

    const onSubmit = async (data: TeamMemberModel) => {
        data.superAdminId = user?.superAdminId;
        data.draftId = draftId;
        if (data.fixedAmount == true) {
            data.onBoradingFee = fixedAmount;
        }
        if (contract !== '') {
            data.document = `${contract.cdnUrl} ${contract.name}`;
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
        {
            (data.hstNumber as unknown as string) == ''
                ? (data.hstNumber = 0)
                : (data.hstNumber as number);
        }
        {
            (data.ratePerHour as unknown as string) == ''
                ? (data.ratePerHour = 0)
                : (data.ratePerHour as number);
        }
        {
            (data.hoursPerDay as unknown as string) == ''
                ? (data.hoursPerDay = 0)
                : (data.hoursPerDay as number);
        }
        {
            (data.monthlyPayoutRate as unknown as string) == ''
                ? (data.monthlyPayoutRate = 0)
                : (data.monthlyPayoutRate as number);
        }
        {
            (data?.isEligibleForLeave as unknown as string) == 'Yes'
                ? (data.isEligibleForLeave = true)
                : (data.isEligibleForLeave = false);
        }
        data.clientId = !clientType ? user?.superAdminId : data.clientId;

        if (data.supervisorId === undefined || '') {
            toast({
                title: 'Please select supervisor to create a team. Create one if none already exists',
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            return;
        }
        if (data.document === undefined || '') {
            toast({
                title: 'Please select a contract document and try again',
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            return;
        }

        //

        try {
            const result = await UserService.addTeamMember(data);
            if (result.status) {
                toast({
                    title: `Invite Sent`,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.replace(router.asPath);
                reset();
                onClose();
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            return;
        } catch (err: any) {
            toast({
                title: err?.message || err?.body?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const radios = ['For me', 'For my client'];
    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'selection',
        defaultValue: clientType ? 'For my client' : 'For me',
        onChange: (value) => updateClientField(value),
    });

    const updateClientField = (value: any) => {
        if (value == 'For me') {
            setClientType(false);
        } else {
            setClientType(true);
        }
    };

    const group = getRootProps();

    useEffect(() => {
        const isUser = Cookies.get('user');
        setClientType(data?.clientId == data?.superAdminId ? false : true);
        if (isUser !== undefined) {
            const userDetails = JSON.parse(isUser as unknown as string);
            reset({
                clientId: data?.clientId || userDetails.superAdminId,
                role: data?.role || 'Team Member',
                employeeType: data?.employeeType || 'regular',
                numberOfDaysEligible:
                    data?.numberOfDaysEligible ||
                    leaveSettings?.eligibleLeaveDays,
                isEligibleForLeave: (data?.isEligibleForLeave as any) || false,
                payRollTypeId:
                    (data?.payRollTypeId as any) ||
                    (subType == 'premium' ? 2 : 1),
                clientRate: data?.clientRate || 0,
                isActive: data?.isActive as any,
                phoneNumber: data?.phoneNumber,
                email: data?.email,
                firstName: data?.firstName,
                lastName: data?.lastName,
                address: data?.address,
                dateOfBirth: data?.dateOfBirth as any,
                supervisorId: data?.supervisorId,
                paymentPartnerId: data?.paymentPartnerId,
                currency:
                    data?.currency || subType != 'premium' ? 'CAD' : 'NGN',
                paymentRate: data?.paymentRate,
                insuranceDocumentUrl: data?.insuranceDocumentUrl,
                voidCheckUrl: data?.voidCheckUrl,
                inCorporationDocumentUrl: data?.inCorporationDocumentUrl,
                paymentFrequency: data?.paymentFrequency,
                fixedAmount: data?.fixedAmount as any,
                onBoradingFee: data?.onBoradingFee || fixedAmount,
                monthlyPayoutRate: data?.monthlyPayoutRate,
                payrollGroupId: data?.payrollGroupId,
                numberOfHoursEligible: data?.numberOfHoursEligible,
                invoiceGenerationType: data?.invoiceGenerationType,
                enableFinancials: data?.enableFinancials as any,
                jobTitle: data?.jobTitle,
                hoursPerDay: data?.hoursPerDay as any,
                title: data?.title,
                startDate: data?.startDate as any,
                endDate: data?.endDate as any,
                hstNumber: data?.hstNumber as any,
                document: data?.document,
                ratePerHour: data?.ratePerHour as any,
                // fixedAmount: true,
            });
        }
    }, []);

    const closeModal = () => {
        setOpenDraft(true);
    };
    const saveToDraft = async (value: TeamMemberModel) => {
        value.superAdminId = data?.superAdminId;
        value.id = data?.id;
        if (value.fixedAmount == true) {
            value.onBoradingFee = fixedAmount;
        }
        if (contract !== '') {
            value.document = `${contract.cdnUrl} ${contract.name}`;
        }
        if (icd !== '') {
            value.inCorporationDocumentUrl = `${icd.cdnUrl} ${icd.name}`;
        }
        if (voidCheck !== '') {
            value.voidCheckUrl = `${voidCheck.cdnUrl} ${voidCheck.name}`;
        }
        if (inc !== '') {
            value.insuranceDocumentUrl = `${inc.cdnUrl} ${inc.name}`;
        }
        {
            (value.hstNumber as unknown as string) == ''
                ? (value.hstNumber = 0)
                : (value.hstNumber as number);
        }
        {
            (value.ratePerHour as unknown as string) == ''
                ? (value.ratePerHour = 0)
                : (value.ratePerHour as number);
        }
        {
            (value.hoursPerDay as unknown as string) == ''
                ? (value.hoursPerDay = 0)
                : (value.hoursPerDay as number);
        }
        {
            (value.monthlyPayoutRate as unknown as string) == ''
                ? (value.monthlyPayoutRate = 0)
                : (value.monthlyPayoutRate as number);
        }
        {
            (value?.isEligibleForLeave as unknown as string) == 'Yes'
                ? (value.isEligibleForLeave = true)
                : (value.isEligibleForLeave = false);
        }
        value.clientId = !clientType ? user?.superAdminId : value.clientId;
        try {
            const result = await DraftService.updateDraft(
                value as UserDraftModel,
            );
            if (result.status) {
                toast({
                    title: `Success`,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.replace(router.asPath);
                reset();
                setOpenDraft(false);
                onClose(false);
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            return;
        } catch (err: any) {
            toast({
                title: err?.message || err?.body?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    console.log({
        errors,
        fin: watch('enableFinancials'),
        py: watch('payRollTypeId'),
    });

    return (
        <>
            <Box>
                <DrawerWrapper
                    onClose={() => closeModal()}
                    isOpen={isOpen}
                    title={'Add a new Team Member'}
                >
                    <Loading loading={loading} />
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid
                            templateColumns={['repeat(1,1fr)', 'repeat(3,1fr)']}
                            gap="1rem 2rem"
                        >
                            <PrimaryInput<TeamMemberModel>
                                label="First Name"
                                name="firstName"
                                error={errors.firstName}
                                placeholder=""
                                defaultValue=""
                                register={register}
                            />
                            <PrimaryInput<TeamMemberModel>
                                label="Last Name"
                                name="lastName"
                                error={errors.lastName}
                                placeholder=""
                                defaultValue=""
                                register={register}
                            />
                            <PrimaryInput<TeamMemberModel>
                                label="Email"
                                name="email"
                                error={errors.email}
                                placeholder=""
                                defaultValue=""
                                register={register}
                            />
                            <PrimaryPhoneInput<TeamMemberModel>
                                label="Phone Number"
                                name="phoneNumber"
                                error={errors.phoneNumber}
                                placeholder="Phone No."
                                control={control}
                            />
                            <PrimaryDate<TeamMemberModel>
                                control={control}
                                name="dateOfBirth"
                                label="Date of Birth"
                                error={errors.dateOfBirth}
                                max={new DateObject().subtract(1, 'days')}
                                defaultValue={moment(data?.dateOfBirth).format(
                                    'DD MM YYYY',
                                )}
                            />

                            <SelectrixBox<TeamMemberModel>
                                control={control}
                                name="isActive"
                                error={errors.isActive}
                                keys="id"
                                keyLabel="label"
                                label="Profile Status"
                                placeholder={
                                    data?.isActive === true
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
                                defaultValue=""
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
                            {subType == 'premium' && (
                                <Box mb="1.5rem">
                                    <Text
                                        fontWeight="500"
                                        mb=".5rem"
                                        fontSize=".9rem"
                                    >
                                        Is this team member for you or for a
                                        client you manage?
                                    </Text>
                                    <HStack w="full" {...group}>
                                        {radios.map((value) => {
                                            const radio = getRadioProps({
                                                value,
                                            });
                                            return (
                                                <RadioBtn {...radio}>
                                                    {value}
                                                </RadioBtn>
                                            );
                                        })}
                                    </HStack>
                                </Box>
                            )}
                            <Grid
                                templateColumns={[
                                    'repeat(1,1fr)',
                                    'repeat(3,1fr)',
                                ]}
                                gap="1rem 2rem"
                                minW="0"
                            >
                                <PrimaryInput<TeamMemberModel>
                                    label="Job Title"
                                    name="jobTitle"
                                    error={errors.jobTitle}
                                    placeholder=""
                                    defaultValue=""
                                    register={register}
                                />

                                {clientType && (
                                    <SelectrixBox<TeamMemberModel>
                                        control={control}
                                        name="clientId"
                                        error={errors.clientId}
                                        keys="id"
                                        keyLabel="organizationName"
                                        label="Current Client"
                                        options={client}
                                        placeholder={
                                            client.find(
                                                (x) => x.id == data?.clientId,
                                            )?.fullName as string
                                        }
                                    />
                                )}
                                {/* {supervisors !== undefined && ( */}
                                <SelectrixBox<TeamMemberModel>
                                    control={control}
                                    name="supervisorId"
                                    error={errors.supervisorId}
                                    keys="id"
                                    keyLabel="fullName"
                                    label="Supervisor"
                                    options={supervisors}
                                    placeholder={
                                        supervisors?.find(
                                            (x) => x.id == data?.supervisorId,
                                        )?.fullName as string
                                    }
                                />
                                {/*  )} */}
                                <Box pos="relative">
                                    <SelectrixBox<TeamMemberModel>
                                        control={control}
                                        name="enableFinancials"
                                        error={errors.enableFinancials}
                                        keys="id"
                                        keyLabel="label"
                                        label="Include Payroll"
                                        placeholder={
                                            includePayroll == true
                                                ? 'Yes'
                                                : 'No'
                                        }
                                        options={[
                                            {
                                                id: true,
                                                label: 'Yes',
                                            },
                                            {
                                                id: false,
                                                label: 'No',
                                            },
                                        ]}
                                    />
                                    {subType != 'premium' && (
                                        <TriggerBox opens={opens} />
                                    )}
                                </Box>
                                <PrimaryInput<TeamMemberModel>
                                    label="Hr/Day"
                                    name="hoursPerDay"
                                    error={errors.hoursPerDay}
                                    placeholder=""
                                    defaultValue=""
                                    type="number"
                                    register={register}
                                />
                                <Box pos="relative">
                                    <SelectrixBox<TeamMemberModel>
                                        control={control}
                                        name="employeeType"
                                        error={errors.employeeType}
                                        keys="id"
                                        keyLabel="label"
                                        label="Employee Type"
                                        placeholder={
                                            watch('employeeType') as string
                                        }
                                        options={[
                                            { id: 'regular', label: 'Regular' },
                                            {
                                                id: 'shift',
                                                label: 'Shift',
                                            },
                                        ]}
                                    />
                                    {subType == 'basic' && (
                                        <TriggerBox opens={opens} />
                                    )}
                                </Box>
                                <SelectrixBox<TeamMemberModel>
                                    control={control}
                                    name="paymentFrequency"
                                    error={errors.paymentFrequency}
                                    keys="id"
                                    keyLabel="label"
                                    label="Timesheet Frequency"
                                    placeholder={
                                        data?.paymentFrequency as string
                                    }
                                    options={[
                                        { id: 'Weekly', label: 'Weekly' },
                                        { id: 'Bi-weekly', label: 'Bi-Weekly' },
                                        { id: 'Monthly', label: 'Monthly' },
                                    ]}
                                />
                            </Grid>
                        </Box>
                        {includePayroll && (
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
                                        Payroll Data
                                    </Text>
                                </Flex>

                                <Grid
                                    templateColumns={[
                                        'repeat(1,1fr)',
                                        'repeat(3,1fr)',
                                    ]}
                                    gap="1rem 2rem"
                                    minW="0"
                                >
                                    <Box pos="relative">
                                        <SelectrixBox<TeamMemberModel>
                                            control={control}
                                            name="payRollTypeId"
                                            error={errors.payRollTypeId}
                                            keys="id"
                                            keyLabel="label"
                                            label="Payroll Type"
                                            placeholder={
                                                payroll == 1
                                                    ? 'Onshore Contract'
                                                    : 'Offshore Contract'
                                            }
                                            options={[
                                                {
                                                    id: 1,
                                                    label: 'Onshore Contract',
                                                },
                                                {
                                                    id: 2,
                                                    label: 'Offshore Contract',
                                                },
                                            ]}
                                        />
                                        {subType != 'premium' && (
                                            <TriggerBox opens={opens} />
                                        )}
                                    </Box>
                                    {payroll == 1 ? (
                                        <>
                                            <PrimaryInput<TeamMemberModel>
                                                label="Rate/Hr"
                                                name="ratePerHour"
                                                error={errors.ratePerHour}
                                                placeholder=""
                                                type="number"
                                                defaultValue=""
                                                register={register}
                                            />

                                            <UploadCareWidget
                                                refs={widgetApiB}
                                                label="Incoporation Document"
                                                filename={
                                                    icd?.name ||
                                                    data?.inCorporationDocumentUrl
                                                }
                                                loading={showLoadingB}
                                                uploadFunction={
                                                    showLoadingStateB
                                                }
                                            />
                                            <UploadCareWidget
                                                refs={widgetApiC}
                                                label="Void Check"
                                                filename={
                                                    voidCheck?.name ||
                                                    data?.voidCheckUrl
                                                }
                                                loading={showLoadingC}
                                                uploadFunction={
                                                    showLoadingStateC
                                                }
                                            />
                                            <UploadCareWidget
                                                refs={widgetApiD}
                                                label="Issuance Certificate"
                                                filename={
                                                    inc?.name ||
                                                    data?.insuranceDocumentUrl
                                                }
                                                loading={showLoadingD}
                                                uploadFunction={
                                                    showLoadingStateD
                                                }
                                            />
                                            <PrimaryInput<TeamMemberModel>
                                                label="HST No."
                                                name="hstNumber"
                                                error={errors.hstNumber}
                                                placeholder=""
                                                defaultValue=""
                                                type="number"
                                                register={register}
                                            />
                                        </>
                                    ) : payroll == 2 ? (
                                        <>
                                            <PrimaryInput<TeamMemberModel>
                                                label="Monthly Payout"
                                                name="monthlyPayoutRate"
                                                error={errors.monthlyPayoutRate}
                                                placeholder=""
                                                defaultValue=""
                                                type="number"
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
                                                    paymentPartner.find(
                                                        (x) =>
                                                            x.id ==
                                                            data?.paymentPartnerId,
                                                    )?.fullName as string
                                                }
                                            />
                                        </>
                                    ) : null}
                                    {clientType && (
                                        <PrimaryInput<TeamMemberModel>
                                            label="Client Rate"
                                            name="clientRate"
                                            error={errors.clientRate}
                                            placeholder=""
                                            defaultValue={''}
                                            register={register}
                                        />
                                    )}
                                    <Box pos="relative">
                                        <SelectrixBox<TeamMemberModel>
                                            control={control}
                                            name="currency"
                                            error={errors.currency}
                                            keys="id"
                                            keyLabel="label"
                                            label="Currency"
                                            placeholder={currency as string}
                                            options={[
                                                { id: 'CAD', label: 'CAD' },
                                                { id: 'NGN', label: 'NGN' },
                                            ]}
                                        />
                                        {subType != 'premium' && (
                                            <TriggerBox opens={opens} />
                                        )}
                                    </Box>
                                    {/* <SelectrixBox<TeamMemberModel>
                                        control={control}
                                        name="paymentFrequency"
                                        error={errors.paymentFrequency}
                                        keys="id"
                                        keyLabel="label"
                                        label="Payment Frequency"
                                        options={[
                                            { id: 'Weekly', label: 'Weekly' },
                                            {
                                                id: 'Bi-weekly',
                                                label: 'Bi-Weekly',
                                            },
                                            { id: 'Monthly', label: 'Monthly' },
                                        ]}
                                    /> */}
                                    <SelectrixBox<TeamMemberModel>
                                        control={control}
                                        name="invoiceGenerationType"
                                        error={errors.invoiceGenerationType}
                                        keys="id"
                                        keyLabel="label"
                                        label="Invoice Type"
                                        placeholder={
                                            data?.invoiceGenerationType as string
                                        }
                                        options={[
                                            { id: 'invoice', label: 'Invoice' },
                                            { id: 'payroll', label: 'Payroll' },
                                        ]}
                                    />
                                    {/* {clientType && ( */}
                                    <SelectrixBox<TeamMemberModel>
                                        control={control}
                                        name="fixedAmount"
                                        error={errors.fixedAmount}
                                        keys="id"
                                        keyLabel="label"
                                        label="Onboarding fee type"
                                        placeholder={
                                            data?.fixedAmount
                                                ? 'Fixed Amount'
                                                : 'Percentage'
                                        }
                                        options={[
                                            {
                                                id: true,
                                                label: 'Fixed amount',
                                            },
                                            {
                                                id: false,
                                                label: 'Percentage',
                                            },
                                        ]}
                                    />
                                    {/* )} */}
                                    {onboarding == false ? (
                                        <SelectrixBox<TeamMemberModel>
                                            control={control}
                                            name="onBoradingFee"
                                            error={errors.onBoradingFee}
                                            keys="fee"
                                            keyLabel="fee"
                                            label="Onboarding fee"
                                            options={percentageAmount}
                                            placeholder={
                                                data?.onBoradingFee as unknown as string
                                            }
                                        />
                                    ) : (
                                        ''
                                    )}
                                </Grid>
                            </Box>
                        )}
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
                                    Contract Details
                                </Text>
                            </Flex>
                            <PrimaryInput<TeamMemberModel>
                                label="Contract Title"
                                name="title"
                                error={errors.title}
                                placeholder=""
                                defaultValue=""
                                register={register}
                            />
                            <Grid
                                templateColumns={[
                                    'repeat(1,1fr)',
                                    'repeat(2,1fr)',
                                ]}
                                gap="1rem 2rem"
                                my="1.5rem"
                            >
                                <PrimaryDate<TeamMemberModel>
                                    control={control}
                                    name="startDate"
                                    label="Start Date"
                                    error={errors.startDate}
                                    placeholder={moment(
                                        data?.startDate as any,
                                    ).format('DD MM YYYY')}
                                    // min={new Date()}
                                />
                                <PrimaryDate<TeamMemberModel>
                                    control={control}
                                    name="endDate"
                                    label="End Date"
                                    error={errors.endDate}
                                    min={new DateObject().add(3, 'days')}
                                    placeholder={moment(
                                        data?.endDate as any,
                                    ).format('DD MM YYYY')}
                                />
                                {/* <PrimaryDate<TeamMemberModel>
                                    control={control}
                                    name="timeSheetGenerationStartDate"
                                    label="Timesheet Start Date"
                                    error={errors.timeSheetGenerationStartDate}
                                    disableWeekend
                                    // min={new DateObject().add(3, 'days')}
                                /> */}
                            </Grid>
                            <UploadCareWidget
                                refs={widgetApi}
                                label="Attach Document"
                                filename={contract?.name || data?.document}
                                loading={showLoading}
                                uploadFunction={showLoadingState}
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
                                    Leave Management
                                </Text>
                            </Flex>
                            <Box pos="relative" mb="1rem">
                                <PrimaryRadio<TeamMemberModel>
                                    label="Are you eligible for Leave"
                                    radios={['No', 'Yes']}
                                    name="isEligibleForLeave"
                                    defaultValue={
                                        data?.isEligibleForLeave ? 'Yes' : 'No'
                                    }
                                    control={control}
                                    error={errors.isEligibleForLeave}
                                />
                            </Box>
                            {((isEligibleForLeave as unknown as string) ==
                                'Yes' ||
                                data?.isEligibleForLeave) && (
                                <Grid
                                    templateColumns={[
                                        'repeat(1,1fr)',
                                        'repeat(3,1fr)',
                                    ]}
                                    gap="1rem 2rem"
                                >
                                    <PrimaryInput<TeamMemberModel>
                                        label="Eligible number of days"
                                        name="numberOfDaysEligible"
                                        error={errors.numberOfDaysEligible}
                                        placeholder=""
                                        defaultValue=""
                                        register={register}
                                        readonly={
                                            leaveSettings?.isStandardEligibleDays
                                        }
                                    />
                                    <PrimaryInput<TeamMemberModel>
                                        label="Eligible number of hours"
                                        name="numberOfHoursEligible"
                                        error={errors.numberOfHoursEligible}
                                        placeholder=""
                                        defaultValue=""
                                        register={register}
                                    />
                                </Grid>
                            )}
                        </Box>

                        <DrawerFooter borderTopWidth="1px" mt="2rem" p="0">
                            <Grid
                                templateColumns="repeat(2,1fr)"
                                gap="1rem 2rem"
                                my="2rem"
                                w="full"
                            >
                                <Button
                                    bgColor="gray.500"
                                    color="white"
                                    height="3rem"
                                    fontSize="14px"
                                    boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                                    onClick={() => closeModal()}
                                >
                                    Close
                                </Button>
                                <Button
                                    bgColor="brand.400"
                                    color="white"
                                    height="3rem"
                                    fontSize="14px"
                                    type="submit"
                                    isLoading={isSubmitting}
                                    spinner={
                                        <BeatLoader color="white" size={10} />
                                    }
                                    boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                                >
                                    <Box pr=".5rem">
                                        <RiMailSendFill />
                                    </Box>
                                    <Box>Send Invite</Box>
                                </Button>
                            </Grid>
                        </DrawerFooter>
                    </form>
                </DrawerWrapper>

                {openDraft && (
                    <ShowPrompt
                        isOpen={openDraft}
                        onClose={() => {
                            setOpenDraft(false);
                            onClose(false);
                        }}
                        onSubmit={handleSubmit(saveToDraft)}
                        loading={isSubmitting}
                        text={`Do you want to save as draft?`}
                    />
                )}
            </Box>
        </>
    );
}

export default DraftOnboardingModal;
