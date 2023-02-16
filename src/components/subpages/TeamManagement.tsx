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
    Tooltip,
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
}

import {
    TeamMemberModel,
    UserService,
    UserView,
    UserViewPagedCollectionStandardResponse,
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

const schema = yup.object().shape({
    lastName: yup.string().required(),
    firstName: yup.string().required(),
    email: yup.string().email().required(),
    phoneNumber: yup.string().required(),
    jobTitle: yup.string().required(),
    clientId: yup.string().required(),
    supervisorId: yup.string().required(),
    isActive: yup.boolean().required(),
    hoursPerDay: yup.number().required(),
    payRollTypeId: yup.number().required(),
    paymentPartnerId: yup.string().when('payRollTypeId', {
        is: 2,
        then: yup.string().required(),
    }),
    ratePerHour: yup.string().when('payRollTypeId', {
        is: 1,
        then: yup.string().required(),
    }),
    hstNumber: yup.string().when('payRollTypeId', {
        is: 1,
        then: yup.string().required(),
    }),
    monthlyPayoutRate: yup.string().when('payRollTypeId', {
        is: 2,
        then: yup.string().required(),
    }),
    currency: yup.string().required(),
    // paymentRate: yup.string().required(),
    fixedAmount: yup.boolean().required(),
    title: yup.string().required(),
    startDate: yup.string().required(),
    endDate: yup.string().required(),
    dateOfBirth: yup.string().required(),
    paymentFrequency: yup.string().required(),
});

function TeamManagement({ adminList, clients, paymentPartner }: adminProps) {
    const client = clients?.filter((x) => x.isActive);
    console.log({ client });

    const { fixedAmount, percentageAmount } = useContext(OnboardingFeeContext);

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<TeamMemberModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            role: 'Team Member',
            onBordingFee: fixedAmount,
        },
    });
    // console.log(watch('onBordingFee'));
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
    const toast = useToast();
    // console.log(watch("payRollTypeId"));
    const payroll = watch('payRollTypeId');
    const onboarding = watch('fixedAmount');
    const clientId = watch('clientId');
    console.log({ payroll });

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
    const showLoadingState = (file) => {
        if (file) {
            file.progress((info) => {
                console.log('File progress: ', info.progress),
                    setShowLoading(true);
            });
            file.done((info) => {
                setShowLoading(false),
                    console.log('File uploaded: ', info),
                    setContractFile(info);
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
        console.log({ id });
        try {
            const data = await UserService.getSupervisors(id);
            setLoading(false);
            console.log({ data });
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
    console.log({ supervisors });

    useEffect(() => {
        getSupervisor(clientId);
    }, [clientId]);

    // console.log({ supervisors });

    const onSubmit = async (data: TeamMemberModel) => {
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
        data.clientId = null;
        console.log({ data });

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

        console.log({ data });

        try {
            const result = await UserService.addTeamMember(data);
            if (result.status) {
                toast({
                    title: `Invite Sent`,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.reload();
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
            console.log({ err });
            toast({
                title: err.body.message || err.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    return (
        <>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <Button
                    bgColor="brand.400"
                    color="white"
                    p=".5rem 1.5rem"
                    height="fit-content"
                    boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                    onClick={onOpen}
                    mb="1rem"
                >
                    +Team Member
                </Button>
                <FilterSearch searchOptions="Search by: Full Name, Job Title, Role, Payroll Type or Status" />
                <Tables
                    tableHead={[
                        'Full Name',
                        'Job Title',
                        'Client Name',
                        // 'Phone No',
                        'Payroll Type',
                        'Role',
                        'Status',
                        '',
                    ]}
                >
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
                        <Grid
                            templateColumns={['repeat(1,1fr)', 'repeat(3,1fr)']}
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
                            <SelectrixBox<TeamMemberModel>
                                control={control}
                                name="clientId"
                                error={errors.clientId}
                                keys="id"
                                keyLabel="organizationName"
                                label="Current Client"
                                options={client}
                            />
                            {supervisors !== undefined && (
                                <SelectrixBox<TeamMemberModel>
                                    control={control}
                                    name="supervisorId"
                                    error={errors.supervisorId}
                                    keys="id"
                                    keyLabel="fullName"
                                    label="Supervisor"
                                    options={supervisors}
                                />
                            )}
                            <SelectrixBox<TeamMemberModel>
                                control={control}
                                name="payRollTypeId"
                                error={errors.payRollTypeId}
                                keys="id"
                                keyLabel="label"
                                label="Payroll Type"
                                options={[
                                    {
                                        id: 1,
                                        label: 'Onshore Contract',
                                    },
                                    {
                                        id: 2,
                                        label: 'Offshore contract',
                                    },
                                ]}
                            />
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
                                    <PrimaryInput<TeamMemberModel>
                                        label="Hr/Day"
                                        name="hoursPerDay"
                                        error={errors.hoursPerDay}
                                        placeholder=""
                                        defaultValue=""
                                        type="number"
                                        register={register}
                                    />
                                    <UploadCareWidget
                                        refs={widgetApiB}
                                        label="Incoporation Document"
                                        filename={icd?.name}
                                        loading={showLoadingB}
                                        uploadFunction={showLoadingStateB}
                                    />
                                    <UploadCareWidget
                                        refs={widgetApiC}
                                        label="Void Check"
                                        filename={voidCheck?.name}
                                        loading={showLoadingC}
                                        uploadFunction={showLoadingStateC}
                                    />
                                    <UploadCareWidget
                                        refs={widgetApiD}
                                        label="Issuance Certificate"
                                        filename={inc?.name}
                                        loading={showLoadingD}
                                        uploadFunction={showLoadingStateD}
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
                                    <PrimaryInput<TeamMemberModel>
                                        label="Hr/Day"
                                        name="hoursPerDay"
                                        error={errors.hoursPerDay}
                                        placeholder=""
                                        defaultValue=""
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
                                    />
                                    <SelectrixBox<TeamMemberModel>
                                        control={control}
                                        name="payrollGroupId"
                                        error={errors.payrollGroupId}
                                        keys="id"
                                        keyLabel="label"
                                        label="Payroll Group"
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
                            ) : null}

                            <PrimaryInput<TeamMemberModel>
                                label="Client Rate"
                                name="clientRate"
                                error={errors.clientRate}
                                placeholder=""
                                defaultValue=""
                                register={register}
                            />
                            <SelectrixBox<TeamMemberModel>
                                control={control}
                                name="currency"
                                error={errors.currency}
                                keys="id"
                                keyLabel="label"
                                label="Currency"
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
                            />
                            <SelectrixBox<TeamMemberModel>
                                control={control}
                                name="fixedAmount"
                                error={errors.fixedAmount}
                                keys="id"
                                keyLabel="label"
                                label="Onboarding fee type"
                                options={[
                                    { id: true, label: 'Fixed amount' },
                                    { id: false, label: 'Percentage' },
                                ]}
                            />
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
                        <Grid
                            templateColumns={['repeat(1,1fr)', 'repeat(3,1fr)']}
                            gap="1rem 2rem"
                        >
                            <PrimaryInput<TeamMemberModel>
                                label="Contract Title"
                                name="title"
                                error={errors.title}
                                placeholder=""
                                defaultValue=""
                                register={register}
                            />
                            <PrimaryDate<TeamMemberModel>
                                control={control}
                                name="startDate"
                                label="Start Date"
                                error={errors.startDate}
                                min={new Date()}
                            />
                            <PrimaryDate<TeamMemberModel>
                                control={control}
                                name="endDate"
                                label="End Date"
                                error={errors.endDate}
                                min={new DateObject().add(3, 'days')}
                            />
                        </Grid>
                        <UploadCareWidget
                            refs={widgetApi}
                            label="Attach Document"
                            filename={contract?.name}
                            loading={showLoading}
                            uploadFunction={showLoadingState}
                        />
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
                                spinner={<BeatLoader color="white" size={10} />}
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
        </>
    );
}

export default TeamManagement;
