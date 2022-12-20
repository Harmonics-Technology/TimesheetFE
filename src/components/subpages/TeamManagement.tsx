/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-sparse-arrays */
import {
    Box,
    Button,
    Flex,
    Select,
    Text,
    HStack,
    Input,
    Tr,
    useDisclosure,
    Grid,
    DrawerFooter,
    useToast,
    Spinner,
    FormLabel,
} from '@chakra-ui/react';
import DrawerWrapper from '@components/bits-utils/Drawer';
import {
    TableActions,
    TableData,
    TableStatus,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import React, { useEffect, useRef, useState } from 'react';
import { Widget } from '@uploadcare/react-widget';
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
import { PrimaryRadio } from '@components/bits-utils/PrimaryRadio';
import { DateObject } from 'react-multi-date-picker';
import FilterSearch from '@components/bits-utils/FilterSearch';
import Loading from '@components/bits-utils/Loading';

const schema = yup.object().shape({
    lastName: yup.string().required(),
    firstName: yup.string().required(),
    email: yup.string().email().required(),
    phoneNumber: yup.string().required(),
    // jobTitle: yup.string().required(),
    // clientId: yup.string().required(),
    // supervisorId: yup.string().required(),
    // isActive: yup.boolean().required(),
    // payRollTypeId: yup.number().required(),
    // hoursPerDay: yup.number().required(),
    // paymentPartnerId: yup.string().required(),
    // ratePerHour: yup.number().required(),
    // currency: yup.string().required(),
    // paymentRate: yup.string().required(),
    // fixedAmount: yup.boolean().required(),
    // title: yup.string().required(),
    // startDate: yup.string().required(),
    // endDate: yup.string().required(),
    // dateOfBirth: yup.string().required(),
});

function TeamManagement({ adminList, clients, paymentPartner }: adminProps) {
    console.log({ adminList });

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
        },
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
    const toast = useToast();
    // console.log(watch("payRollTypeId"));
    const payroll = watch('payRollTypeId');
    const clientId = watch('clientId');
    // console.log({ clientId });

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
                setSupervisors(data.data);
                return;
            }
            setLoading(false);
        } catch (error) {
            //
        }
    };

    useEffect(() => {
        getSupervisor(clientId);
    }, [clientId]);

    console.log({ supervisors });

    const onSubmit = async (data: TeamMemberModel) => {
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
        data.clientId = null;

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
        } catch (err) {
            toast({
                title: 'An error occurred',
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
                >
                    +Team Member
                </Button>
                <FilterSearch />
                <Tables
                    tableHead={[
                        'Name',
                        'Job Title',
                        'Client',
                        'Phone No',
                        'Role',
                        'Status',
                        '',
                    ]}
                >
                    <>
                        {adminList?.data?.value?.map((x: UserView) => (
                            <Tr key={x.id}>
                                <TableData name={x.firstName} />
                                <TableData
                                    name={x.employeeInformation?.jobTitle}
                                />
                                <TableData
                                    name={
                                        x.employeeInformation?.client
                                            ?.organizationName
                                    }
                                />
                                <TableData name={x.phoneNumber} />
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
                        <PrimaryInput<TeamMemberModel>
                            label="Job Title"
                            name="jobTitle"
                            error={errors.jobTitle}
                            placeholder=""
                            defaultValue=""
                            register={register}
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
                            name="clientId"
                            error={errors.clientId}
                            keys="id"
                            keyLabel="fullName"
                            label="Current Client"
                            options={clients}
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
                            <SelectrixBox<TeamMemberModel>
                                control={control}
                                name="payRollTypeId"
                                error={errors.payRollTypeId}
                                keys="id"
                                keyLabel="label"
                                label="Payroll Type"
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
                            {payroll == 1 ? (
                                <>
                                    <PrimaryInput<TeamMemberModel>
                                        label="Rate/Hr"
                                        name="ratePerHour"
                                        error={errors.ratePerHour}
                                        placeholder=""
                                        defaultValue=""
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
                                    <Box>
                                        <FormLabel
                                            textTransform="capitalize"
                                            width="fit-content"
                                            fontSize=".8rem"
                                        >
                                            Incorporation Document
                                        </FormLabel>

                                        <Flex
                                            outline="1px solid"
                                            outlineColor="gray.300"
                                            h="2.6rem"
                                            align="center"
                                            pr="1rem"
                                            w="full"
                                            // justifyContent="space-between"
                                        >
                                            <Flex
                                                bgColor="#f5f5f5"
                                                fontSize=".8rem"
                                                px="1rem"
                                                h="full"
                                                align="center"
                                                cursor="pointer"
                                                my="auto"
                                                fontWeight="600"
                                                onClick={() =>
                                                    widgetApiB.current.openDialog()
                                                }
                                            >
                                                <Text noOfLines={1} mb="0">
                                                    Choose File
                                                </Text>
                                            </Flex>

                                            {showLoadingB ? (
                                                <Flex align="center">
                                                    <Text
                                                        mb="0"
                                                        fontStyle="italic"
                                                        mr="1rem"
                                                    >
                                                        ...loading data info
                                                    </Text>
                                                    <Spinner />
                                                </Flex>
                                            ) : (
                                                <Text
                                                    noOfLines={1}
                                                    my="auto"
                                                    px=".5rem"
                                                >
                                                    {icd?.name ||
                                                        'No File Chosen'}
                                                </Text>
                                            )}
                                        </Flex>
                                        <Box display="none">
                                            <Widget
                                                publicKey="fda3a71102659f95625f"
                                                clearable
                                                onFileSelect={showLoadingStateB}
                                                ref={widgetApiB}
                                                systemDialog={true}
                                                inputAcceptTypes={
                                                    '.docx,.pdf, .doc'
                                                }
                                            />
                                        </Box>
                                    </Box>
                                    <Box>
                                        <FormLabel
                                            textTransform="capitalize"
                                            width="fit-content"
                                            fontSize=".8rem"
                                        >
                                            Void check
                                        </FormLabel>

                                        <Flex
                                            outline="1px solid"
                                            outlineColor="gray.300"
                                            h="2.6rem"
                                            align="center"
                                            pr="1rem"
                                            w="full"
                                            // justifyContent="space-between"
                                        >
                                            <Flex
                                                bgColor="#f5f5f5"
                                                fontSize=".8rem"
                                                px="1rem"
                                                h="full"
                                                align="center"
                                                cursor="pointer"
                                                my="auto"
                                                fontWeight="600"
                                                onClick={() =>
                                                    widgetApiC.current.openDialog()
                                                }
                                            >
                                                <Text noOfLines={1} mb="0">
                                                    Choose File
                                                </Text>
                                            </Flex>

                                            {showLoadingC ? (
                                                <Flex align="center">
                                                    <Text
                                                        mb="0"
                                                        fontStyle="italic"
                                                        mr="1rem"
                                                    >
                                                        ...loading data info
                                                    </Text>
                                                    <Spinner />
                                                </Flex>
                                            ) : (
                                                <Text
                                                    noOfLines={1}
                                                    my="auto"
                                                    px=".5rem"
                                                >
                                                    {voidCheck?.name ||
                                                        'No File Chosen'}
                                                </Text>
                                            )}
                                        </Flex>
                                        <Box display="none">
                                            <Widget
                                                publicKey="fda3a71102659f95625f"
                                                clearable
                                                onFileSelect={showLoadingStateC}
                                                ref={widgetApiC}
                                                systemDialog={true}
                                                inputAcceptTypes={
                                                    '.docx,.pdf, .doc'
                                                }
                                            />
                                        </Box>
                                    </Box>
                                    <Box>
                                        <FormLabel
                                            textTransform="capitalize"
                                            width="fit-content"
                                            fontSize=".8rem"
                                        >
                                            Issuance Certificate
                                        </FormLabel>

                                        <Flex
                                            outline="1px solid"
                                            outlineColor="gray.300"
                                            h="2.6rem"
                                            align="center"
                                            pr="1rem"
                                            w="full"
                                            // justifyContent="space-between"
                                        >
                                            <Flex
                                                bgColor="#f5f5f5"
                                                fontSize=".8rem"
                                                px="1rem"
                                                h="full"
                                                align="center"
                                                cursor="pointer"
                                                my="auto"
                                                fontWeight="600"
                                                onClick={() =>
                                                    widgetApiD.current.openDialog()
                                                }
                                            >
                                                <Text noOfLines={1} mb="0">
                                                    Choose File
                                                </Text>
                                            </Flex>

                                            {showLoadingD ? (
                                                <Flex align="center">
                                                    <Text
                                                        mb="0"
                                                        fontStyle="italic"
                                                        mr="1rem"
                                                    >
                                                        ...loading data info
                                                    </Text>
                                                    <Spinner />
                                                </Flex>
                                            ) : (
                                                <Text
                                                    noOfLines={1}
                                                    my="auto"
                                                    px=".5rem"
                                                >
                                                    {inc?.name ||
                                                        'No File Chosen'}
                                                </Text>
                                            )}
                                        </Flex>
                                        <Box display="none">
                                            <Widget
                                                publicKey="fda3a71102659f95625f"
                                                clearable
                                                onFileSelect={showLoadingStateD}
                                                ref={widgetApiD}
                                                systemDialog={true}
                                                inputAcceptTypes={
                                                    '.docx,.pdf, .doc'
                                                }
                                            />
                                        </Box>
                                    </Box>

                                    <PrimaryInput<TeamMemberModel>
                                        label="HST No."
                                        name="hstNumber"
                                        error={errors.hstNumber}
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
                                </>
                            ) : payroll == 2 ? (
                                <>
                                    <PrimaryInput<TeamMemberModel>
                                        label="Monthly Payout"
                                        name="monthlyPayoutRate"
                                        error={errors.monthlyPayoutRate}
                                        placeholder=""
                                        defaultValue=""
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
                                    { id: 'weekly', label: 'Weekly' },
                                    { id: 'bi-weekly', label: 'Bi-Weekly' },
                                    { id: 'monthly', label: 'Monthly' },
                                ]}
                            />
                        </Grid>
                        <Box my=".8rem">
                            <PrimaryRadio<TeamMemberModel>
                                name="fixedAmount"
                                control={control}
                                error={errors.fixedAmount}
                                radios={[
                                    { label: 'Fixed amount', val: 'true' },
                                    { label: 'Percentage', val: 'false' },
                                ]}
                            />
                        </Box>
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
                        <Box>
                            <FormLabel
                                textTransform="capitalize"
                                width="fit-content"
                                fontSize=".8rem"
                            >
                                Attach Document
                            </FormLabel>

                            <Flex
                                outline="1px solid"
                                outlineColor="gray.300"
                                h="2.6rem"
                                align="center"
                                pr="1rem"
                                w={['100%', '63%']}
                                // justifyContent="space-between"
                            >
                                <Flex
                                    bgColor="#f5f5f5"
                                    fontSize=".8rem"
                                    px="2rem"
                                    h="full"
                                    align="center"
                                    cursor="pointer"
                                    my="auto"
                                    fontWeight="600"
                                    onClick={() =>
                                        widgetApi.current.openDialog()
                                    }
                                >
                                    Choose File
                                </Flex>
                                <Text noOfLines={1} my="auto" px=".5rem">
                                    {contract.name}
                                </Text>
                                {showLoading && (
                                    <Flex align="center">
                                        <Text
                                            mb="0"
                                            fontStyle="italic"
                                            mr="1rem"
                                        >
                                            ...loading data info
                                        </Text>
                                        <Spinner />
                                    </Flex>
                                )}
                            </Flex>
                            <Box display="none">
                                <Widget
                                    publicKey="fda3a71102659f95625f"
                                    clearable
                                    onFileSelect={showLoadingState}
                                    ref={widgetApi}
                                    systemDialog={true}
                                    inputAcceptTypes={'.docx,.pdf, .doc'}
                                />
                            </Box>
                        </Box>
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
