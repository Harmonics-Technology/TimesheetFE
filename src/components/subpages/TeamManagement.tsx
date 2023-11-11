/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-sparse-arrays */
import {
    Box,
    Button,
    Flex,
    Text,
    Tr,
    useDisclosure,
    Grid,
    DrawerFooter,
    useToast,
    Icon,
    HStack,
    useRadioGroup,
} from '@chakra-ui/react';
import DrawerWrapper from '@components/bits-utils/Drawer';
import {
    TableActions,
    TableData,
    TableStatus,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RiMailSendFill } from 'react-icons/ri';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
interface adminProps {
    adminList: UserViewPagedCollectionStandardResponse;
    clients: UserView[];
    paymentPartner: UserView[];
    leaveSettings: LeaveConfigurationView;
    isSuperAdmin?: boolean;
}

import {
    LeaveConfigurationView,
    TeamMemberModel,
    UserService,
    UserView,
    UserViewPagedCollectionStandardResponse,
    ControlSettingView,
} from 'src/services';
import Pagination from '@components/bits-utils/Pagination';
import { useRouter } from 'next/router';
import { PrimaryPhoneInput } from '@components/bits-utils/PrimaryPhoneInput';
import { PrimaryDate } from '@components/bits-utils/PrimaryDate';
import { SelectrixBox } from '@components/bits-utils/Selectrix';
import { DateObject } from 'react-multi-date-picker';
import FilterSearch from '@components/bits-utils/FilterSearch';
import Loading from '@components/bits-utils/Loading';
import BeatLoader from 'react-spinners/BeatLoader';
import UploadCareWidget from '@components/bits-utils/UploadCareWidget';
import { OnboardingFeeContext } from '@components/context/OnboardingFeeContext';
import { BsDownload } from 'react-icons/bs';
import { ExportReportModal } from '@components/bits-utils/ExportReportModal';
import { PrimaryRadio } from '@components/bits-utils/PrimaryRadio';
import { UserContext } from '@components/context/UserContext';
import RadioBtn from '@components/bits-utils/RadioBtn';
import { TriggerBox } from '@components/bits-utils/TriggerBox';
import Cookies from 'js-cookie';

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
        then: yup.string().when('payRollTypeId', {
            is: 2,
            then: yup.string().required(),
        }),
    }),
    ratePerHour: yup.string().when('enableFinancials', {
        is: true,
        then: yup.string().when('payRollTypeId', {
            is: 1,
            then: yup.string().required(),
        }),
    }),
    hstNumber: yup.number().when('enableFinancials', {
        is: true,
        then: yup.number().when('payRollTypeId', {
            is: 1,
            then: yup.number().required(),
        }),
    }),
    monthlyPayoutRate: yup.string().when('enableFinancials', {
        is: true,
        then: yup.string().when('payRollTypeId', {
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
    onBordingFee: yup.string().when('fixedAmount', {
        is: false,
        then: yup.string().required(),
    }),
});

function TeamManagement({
    adminList,
    clients,
    paymentPartner,
    leaveSettings,
    isSuperAdmin,
}: adminProps) {
    const client = clients?.filter((x) => x.isActive);
    //

    const { fixedAmount, percentageAmount } = useContext(OnboardingFeeContext);

    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<TeamMemberModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        // defaultValues: {

        // },
    });
    //
    // console.log({ errors });
    const { isOpen, onOpen, onClose } = useDisclosure();
    // const { isOpen: opened, onOpen: opens, onClose: closed } = useDisclosure();
    const { user, opens, subType, accessControls } = useContext(UserContext);
    const userAccess: ControlSettingView = accessControls;
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

    const onSubmit = async (data: TeamMemberModel) => {
        data.superAdminId = user?.superAdminId;
        if (data.fixedAmount == true) {
            data.onBordingFee = fixedAmount;
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
                reset()
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

    const { isOpen: open, onOpen: onOpens, onClose: close } = useDisclosure();
    const thead = [
        'Name',
        'Job Title',
        'Client Name',
        'Payroll Type',
        'Role',
        'Status',
        '',
    ];

    // subType = 'onshore';

    //

    const radios = ['For me', 'For my client'];
    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'selection',
        defaultValue: 'for my client',
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
        if (isUser !== undefined) {
            const userDetails = JSON.parse(isUser as unknown as string);
            reset({
                clientId: userDetails.superAdminId,
                role: 'Team Member',
                onBordingFee: fixedAmount,
                employeeType: 'regular',
                numberOfDaysEligible: leaveSettings?.eligibleLeaveDays,
                isEligibleForLeave: false,
                payRollTypeId: subType == 'premium' ? 2 : 1,
                currency: subType != 'premium' ? 'CAD' : 'NGN',
                clientRate: 0,
                // fixedAmount: true,
            });
        }
    }, []);

    return (
        <>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <Flex justify="space-between" mb="1rem">
                    {(userAccess?.adminOBoarding || isSuperAdmin) && (
                        <Button
                            bgColor="brand.400"
                            color="white"
                            p=".5rem 1.5rem"
                            height="fit-content"
                            boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                            onClick={onOpen}
                        >
                            +Team Member
                        </Button>
                    )}
                    <Button
                        bgColor="brand.600"
                        color="white"
                        p=".5rem 1.5rem"
                        height="fit-content"
                        // boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                        onClick={onOpens}
                        borderRadius="25px"
                    >
                        Download <Icon as={BsDownload} ml=".5rem" />
                    </Button>
                </Flex>
                <FilterSearch searchOptions="Search by: Full Name, Job Title, Role, Payroll Type or Status" />
                <Tables tableHead={thead}>
                    <>
                        {adminList?.data?.value?.map((x: UserView) => (
                            <Tr key={x.id}>
                                <TableData name={x.fullName} />
                                <TableData
                                    name={x.employeeInformation?.jobTitle}
                                />

                                <TableData name={x.clientName} />

                                {/* <TableData name={x.phoneNumber} /> */}
                                <TableData
                                    name={x.employeeInformation?.payrollType}
                                />
                                <TableData name={x.role} />
                                <TableStatus name={x.isActive} />
                                <TableActions
                                    id={x.id}
                                    route="team-members"
                                    email={x.email}
                                />
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={adminList} />
            </Box>
            {isOpen && (
                <DrawerWrapper
                    onClose={onClose}
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
                            />

                            <SelectrixBox<TeamMemberModel>
                                control={control}
                                name="isActive"
                                error={errors.isActive}
                                keys="id"
                                keyLabel="label"
                                label="Profile Status"
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
                                                filename={icd?.name}
                                                loading={showLoadingB}
                                                uploadFunction={
                                                    showLoadingStateB
                                                }
                                            />
                                            <UploadCareWidget
                                                refs={widgetApiC}
                                                label="Void Check"
                                                filename={voidCheck?.name}
                                                loading={showLoadingC}
                                                uploadFunction={
                                                    showLoadingStateC
                                                }
                                            />
                                            <UploadCareWidget
                                                refs={widgetApiD}
                                                label="Issuance Certificate"
                                                filename={inc?.name}
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
                                            name="onBordingFee"
                                            error={errors.onBordingFee}
                                            keys="fee"
                                            keyLabel="fee"
                                            label="Onboarding fee"
                                            options={percentageAmount}
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
                                    // min={new Date()}
                                />
                                <PrimaryDate<TeamMemberModel>
                                    control={control}
                                    name="endDate"
                                    label="End Date"
                                    error={errors.endDate}
                                    min={new DateObject().add(3, 'days')}
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
                                filename={contract?.name}
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
                                    control={control}
                                    error={errors.isEligibleForLeave}
                                />
                            </Box>
                            {(isEligibleForLeave as unknown as string) ==
                                'Yes' && (
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
                                    onClick={() => onClose()}
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
            )}
            {open && (
                <ExportReportModal
                    isOpen={open}
                    onClose={close}
                    data={thead}
                    record={2}
                    fileName={'Team members'}
                    model="users"
                />
            )}
        </>
    );
}

export default TeamManagement;
