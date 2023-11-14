import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Box,
    Button,
    Flex,
    FormLabel,
    Grid,
    HStack,
    Spinner,
    Text,
    useToast,
} from '@chakra-ui/react';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { BsPersonCheck } from 'react-icons/bs';
import { OnboardingFeeContext } from '@components/context/OnboardingFeeContext';
import UploadCareWidget from './UploadCareWidget';
import { formatDate } from '@components/generics/functions/formatDate';
import { useLeavePageConfirmation } from '@components/generics/useLeavePageConfirmation';
import Link from 'next/link';
import { UserContext } from '@components/context/UserContext';
import { ActivateUserAlert } from './ActivateUserAlert';

const schema = yup.object().shape({});
interface ActivateUserPageProps {
    userProfile?: UserView;
    // clients: UserView[];
    supervisor: UserView[];
    paymentPartner: UserView[];
    id: string;
}

function ActivateUserPage({
    userProfile,
    // clients,
    supervisor,
    paymentPartner,
    id,
}: ActivateUserPageProps) {
    const eligible = userProfile?.employeeInformation?.isEligibleForLeave;

    const {
        register,
        handleSubmit,
        control,
        watch,
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
            onBoradingFee: userProfile?.employeeInformation?.onBoradingFee,
            monthlyPayoutRate:
                userProfile?.employeeInformation?.monthlyPayoutRate,
            payrollGroupId: userProfile?.employeeInformation?.payrollGroupId,
            isEligibleForLeave:
                userProfile?.employeeInformation?.isEligibleForLeave,
            numberOfDaysEligible:
                userProfile?.employeeInformation?.numberOfDaysEligible,
            numberOfHoursEligible:
                userProfile?.employeeInformation?.numberOfHoursEligible,
        },
    });
    const router = useRouter();
    const toast = useToast();

    const payroll = userProfile?.employeeInformation?.payrollType;
    const payrolls = watch('payRollTypeId');
    const onboarding = watch('fixedAmount');
    const isEligibleForLeave = watch('isEligibleForLeave');

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

    const downloadFile = (url: any) => {
        axios
            .get(url, {
                responseType: 'blob',
            })
            .then((res) => {
                fileDownload(res.data, `${url.split(' ').pop()}`);
            });
    };

    const { fixedAmount, percentageAmount } = useContext(OnboardingFeeContext);
    const onSubmit = async (data: TeamMemberModel) => {
        // data.isActive = data.isActive === ('true' as unknown as boolean);
        if (data.fixedAmount == true) {
            data.onBoradingFee = fixedAmount;
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

        try {
            const result = await UserService.updateTeamMember(data);
            //
            if (result.status) {
                toast({
                    title: 'Profile Update Success',
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.replace(router.asPath);
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (error) {
            toast({
                title: `Check your network connection and try again`,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    const [loading, setLoading] = useState<boolean>(false);
    const ActivateUserProfile = async () => {
        try {
            setLoading(true);
            const result = await UserService.activateTeamMember(id);
            if (result.status) {
                setLoading(false);
                toast({
                    title: 'User has beeen succesfully activated',
                    status: 'success',
                    position: 'top-right',
                });
                router.replace(router.asPath);
                return;
            }
            setLoading(false);
            toast({
                title: result.message,
                status: 'error',
                position: 'top-right',
            });
            return;
        } catch (err: any) {
            toast({
                position: 'top-right',
                title: err?.body?.message || err.message,
                status: 'error',
            });
        }
    };
    useLeavePageConfirmation(isDirty && !isSubmitting);
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    return (
        <>
            {userProfile?.isActive && (
                <ActivateUserAlert
                    title="Account Activated!"
                    desc=" This user has already been activated by an admin"
                    url={`/${role}/dashboard`}
                    link={true}
                    btnLink="Go to Dashboard"
                    color={'success'}
                />
            )}
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                minH="80vh"
                // w="80%"
                // mx="auto"
                // p="2rem"
                boxShadow="sm"
            >
                {/* <Text>New Team Member</Text> */}
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
                            defaultValue={moment(
                                userProfile?.dateOfBirth,
                            ).format('DD MM YYYY')}
                            max={new DateObject().subtract(1, 'days')}
                        />
                        {/* <SelectrixBox<TeamMemberModel>
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
                        /> */}
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
                                    userProfile?.employeeInformation?.client
                                        ?.fullName as string
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
                                disabled={true}
                                placeholder={userProfile?.role as string}
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
                                        ?.payrollType as string) ||
                                    'Please Select'
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
                                            label="Issuance Certificate"
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
                                        keyLabel="fullName"
                                        label="Payment Partner"
                                        options={paymentPartner}
                                        placeholder={
                                            userProfile?.employeeInformation
                                                ?.paymentPartner
                                                ?.fullName as string
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
                                            (userProfile?.employeeInformation
                                                ?.payrollGroup as string) ||
                                            'Please select'
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
                                    userProfile?.employeeInformation
                                        ?.fixedAmount == true
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
                                    name="onBoradingFee"
                                    error={errors.onBoradingFee}
                                    keys="fee"
                                    keyLabel="fee"
                                    label="Onboarding fee"
                                    placeholder={
                                        userProfile?.employeeInformation
                                            ?.onBoradingFee as unknown as string
                                    }
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
                                Leave Management
                            </Text>
                        </Flex>

                        <Grid
                            templateColumns={['repeat(1,1fr)', 'repeat(3,1fr)']}
                            gap="1rem 2rem"
                        >
                            <PrimaryRadio
                                label="Are you eligible for Leave"
                                radios={['No', 'Yes']}
                                name="isEligibleForLeave"
                                control={control}
                                error={errors.isEligibleForLeave}
                                defaultValue={eligible == true ? 'Yes' : 'No'}
                            />

                            {(isEligibleForLeave as unknown as string) ==
                                'No' ||
                                (eligible == true && (
                                    <PrimaryInput<TeamMemberModel>
                                        label="Number of days"
                                        name="numberOfDaysEligible"
                                        error={errors.numberOfDaysEligible}
                                        placeholder=""
                                        defaultValue={
                                            userProfile?.employeeInformation
                                                ?.numberOfDaysEligible
                                        }
                                        register={register}
                                    />
                                ))}
                            {(isEligibleForLeave as unknown as string) ==
                                'No' ||
                                (eligible == true && (
                                    <PrimaryInput<TeamMemberModel>
                                        label="Number of hours"
                                        name="numberOfHoursEligible"
                                        error={errors.numberOfHoursEligible}
                                        placeholder=""
                                        defaultValue={
                                            userProfile?.employeeInformation
                                                ?.numberOfHoursEligible
                                        }
                                        register={register}
                                    />
                                ))}
                        </Grid>
                    </Box>
                    <ContractTable userProfile={userProfile} />
                </form>
                <Grid
                    templateColumns={['repeat(2,1fr)', 'repeat(2,1fr)']}
                    gap="1rem 2rem"
                    my="2rem"
                >
                    <Button
                        bgColor="gray.400"
                        color="white"
                        height="3rem"
                        fontSize="14px"
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
                    <Button
                        bgColor="brand.400"
                        color="white"
                        height="3rem"
                        fontSize="14px"
                        onClick={ActivateUserProfile}
                        isLoading={loading}
                        disabled={userProfile?.isActive as boolean}
                        spinner={<BeatLoader color="white" size={10} />}
                        boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                    >
                        <Box pr=".5rem">
                            <BsPersonCheck />
                        </Box>
                        <Box>Activate User</Box>
                    </Button>
                </Grid>
            </Box>
        </>
    );
}

export default ActivateUserPage;
