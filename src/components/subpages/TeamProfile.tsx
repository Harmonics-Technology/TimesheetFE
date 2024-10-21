import {
    Box,
    Button,
    Flex,
    FormLabel,
    Grid,
    HStack,
    Text,
    useDisclosure,
    Heading,
    useToast,
    InputRightElement,
} from '@chakra-ui/react';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { VscSaveAs } from 'react-icons/vsc';
import {
    OnboardingFeeService,
    TeamMemberModel,
    UserService,
    UserView,
} from 'src/services';
import { useRouter } from 'next/router';
import { PrimaryPhoneInput } from '@components/bits-utils/PrimaryPhoneInput';
import { PrimaryDate } from '@components/bits-utils/PrimaryDate';
import { PrimaryRadio } from '@components/bits-utils/PrimaryRadio';
import { DateObject } from 'react-multi-date-picker';
import moment from 'moment';
import axios from 'axios';
import fileDownload from 'js-file-download';
import BeatLoader from 'react-spinners/BeatLoader';
import UploadCareWidget from '@components/bits-utils/UploadCareWidget';
import { OnboardingFeeContext } from '@components/context/OnboardingFeeContext';
import ConfirmChangeModal from '@components/bits-utils/ConfirmChangeModal';
import { useLeavePageConfirmation } from '@components/generics/useLeavePageConfirmation';
import { UserContext } from '@components/context/UserContext';
import { TriggerBox } from '@components/bits-utils/TriggerBox';
import { PrimarySelect } from '@components/bits-utils/PrimarySelect';
import { getUniqueListBy } from '@components/generics/functions/getUniqueList';
import {
    getCurrencyName,
    getFileName,
} from '@components/generics/functions/getCurrencyName';
import { LicenseEditBox } from '@components/bits-utils/LicenseEditBox';
import { SelectBlank } from '@components/bits-utils/SelectBlank';
import ContractTable from '@components/bits-utils/ContractTable';
import { LicenseRevoke } from '@components/bits-utils/LicenseRevoke';
import { CustomSelectBox } from '@components/bits-utils/ProjectManagement/Generics/CustomSelectBox';
import InputBlank from '@components/bits-utils/InputBlank';
import { convertYesNo } from '@components/generics/functions/ConvertStringToBool';

const schema = yup.object().shape({});
interface TeamProfileProps {
    userProfile?: UserView;
    clients: UserView[];
    supervisor: UserView[];
    paymentPartner: UserView[];
    id: string;
    isSuperAdmin?: boolean;
    currencies: any;
    department: any;
    subs: any;
    fees?: any;
}

function TeamProfile({
    userProfile,
    clients,
    supervisor,
    paymentPartner,
    id,
    isSuperAdmin,
    currencies,
    department,
    subs,
    fees,
}: TeamProfileProps) {
    const { user, opens, subType } = useContext(UserContext);

    console.log({ clients });

    clients =
        clients?.length <= 0
            ? [{ id: user?.superAdminId, fullName: user?.fullName }]
            : [
                  ...clients,
                  { id: user?.superAdminId, fullName: user?.fullName },
              ];
    //
    const eligible = userProfile?.employeeInformation?.isEligibleForLeave;

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
            id: userProfile?.id,
            firstName: userProfile?.firstName,
            lastName: userProfile?.lastName,
            hoursPerDay: userProfile?.employeeInformation?.hoursPerDay,
            role: userProfile?.role as unknown as string,
            isActive: userProfile?.isActive,
            phoneNumber: userProfile?.phoneNumber,
            email: userProfile?.email,
            dateOfBirth: userProfile?.dateOfBirth,
            clientId: userProfile?.employeeInformation?.clientId,
            supervisorId: userProfile?.employeeInformation?.supervisorId,
            paymentPartnerId:
                userProfile?.employeeInformation?.paymentPartnerId || undefined,
            currency: userProfile?.employeeInformation?.currency,

            paymentFrequency:
                userProfile?.employeeInformation?.paymentFrequency,
            payrollGroupId: userProfile?.employeeInformation?.payrollGroupId,
            isEligibleForLeave:
                userProfile?.employeeInformation?.isEligibleForLeave,
            numberOfDaysEligible:
                userProfile?.employeeInformation?.numberOfDaysEligible,
            // numberOfHoursEligible:
            //     userProfile?.employeeInformation?.numberOfHoursEligible,
            employeeType: userProfile?.employeeInformation?.employeeType,
            invoiceGenerationType:
                userProfile?.employeeInformation?.invoiceGenerationType,
            enableFinancials:
                userProfile?.employeeInformation?.enableFinancials,
            departments: userProfile?.userDepartments as any,
            address: userProfile?.address,
            clientSubscriptionId: userProfile?.clientSubscriptionId,
            employmentContractType:
                userProfile?.employeeInformation?.employmentContractType,
            jobTitle: userProfile?.employeeInformation?.jobTitle,
            paymentProcessingFee:
                userProfile?.employeeInformation?.paymentProcessingFee,
            paymentProcessingFeeType:
                userProfile?.employeeInformation?.paymentProcessingFeeType ||
                undefined,
            payrollProcessingType:
                userProfile?.employeeInformation?.payrollProcessingType,
            rate: userProfile?.employeeInformation?.rate,
            rateType: userProfile?.employeeInformation?.rateType,
            ratePerHour: userProfile?.employeeInformation?.ratePerHour,
            tax: userProfile?.employeeInformation?.tax,
            taxType: userProfile?.employeeInformation?.taxType,
            timesheetFrequency:
                userProfile?.employeeInformation?.timesheetFrequency,
            payrollStructure:
                userProfile?.employeeInformation?.payrollStructure,
            rolledOverLeave: userProfile?.employeeInformation?.rolledOverLeave,
            hasRollOverLeave:
                userProfile?.employeeInformation?.hasRollOverLeave,
            expiryDateOfRolledOverLeave:
                userProfile?.employeeInformation?.expiryDateOfRolledOverLeave,
            hasUtilizeLeaveDaysToDate:
                userProfile?.employeeInformation?.hasUtilizeLeaveDaysToDate,
            utilizedLeave: userProfile?.employeeInformation?.utilizedLeave,
        },
    });
    const router = useRouter();
    const toast = useToast();
    const includePayroll = watch('enableFinancials');
    const hasUtlized = watch('hasUtilizeLeaveDaysToDate');

    // console.log({ userProfile, rle: watch('role') });
    //
    const isFlatFeeSelected = watch('payrollStructure') == 'flat';
    const isIncSelected = watch('payrollStructure') == 'inc';
    const isPaymentPartnerSelected =
        watch('payrollProcessingType') == 'payment partner';
    const paymentPartnerId = watch('paymentPartnerId');
    const taxType = watch('taxType');
    const uniqueItems = getUniqueListBy(currencies, 'currency');
    const [payFees, setPayFees] = useState<any>(fees);

    // console.log({ clients });

    // console.log({ userProfile });
    const getPaymentPartnerFees = async (id) => {
        if (id === undefined) {
            return;
        }
        setLoading(true);
        try {
            const data = await OnboardingFeeService.listOnboardingFee(
                0,
                10,
                id,
            );
            if (data.status) {
                setLoading(false);
                setPayFees(data?.data?.value);
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
    useEffect(() => {
        getPaymentPartnerFees(paymentPartnerId);
    }, [paymentPartnerId]);

    const payroll = userProfile?.employeeInformation?.payrollType;
    const payrolls = watch('payRollTypeId');
    const onboarding = watch('fixedAmount');

    const isEligibleForLeave = watch('isEligibleForLeave');
    const hasRolledOverLeave = watch('hasRollOverLeave');
    const hasUtilizeLeaveDaysToDate = watch('hasUtilizeLeaveDaysToDate');

    const [contract, setContractFile] = useState<any>('');
    const [showLoading, setShowLoading] = useState(false);
    const widgetApi = useRef<any>();

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
    //

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
    const percentageAmounts = percentageAmount?.sort(
        (a, b) => (a.fee as number) - (b.fee as number),
    );
    //
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { hstAmount } = useContext(OnboardingFeeContext);
    const [selected, setSelected] = useState(userProfile?.role as string);
    const changeUserRole = async (val) => {
        setSelected(val);
        onOpen();
    };

    const curentLicense = subs?.find(
        (x) => x.subscriptionId === userProfile?.clientSubscriptionId,
    );
    const [selectedLicense, setSelectedLicense] = useState<any>(curentLicense);
    const addLicense = (license) => {
        setSelectedLicense(license);
    };
    const removeLicense = (id) => {
        setSelectedLicense(undefined);
    };

    // const joinedDept = [
    //     ...userProfile?.employeeInformation?.department,
    //     userProfile?.userDepartments,
    // ];
    const [selectedDepartment, setSelectedDepartment] = useState<any>(
        userProfile?.userDepartments?.map((obj) => ({
            id: obj?.department?.id,
            name: obj?.department?.name,
        })) || [],
    );

    // console.log({ selectedDepartment });
    //
    const addDepartment = (user) => {
        const filtered = selectedDepartment?.find((x) => x.id === user.id);
        if (filtered) return;
        setSelectedDepartment([...selectedDepartment, user]);
    };
    //
    const removeDepartment = (id) => {
        const filtered = selectedDepartment?.filter((x) => x.id !== id);
        setSelectedDepartment(filtered);
    };

    const onSubmit = async (data: TeamMemberModel) => {
        // data.isActive = data.isActive === ('true' as unknown as boolean);

        // data.clientId = userProfile?.employeeInformation?.client?.id;
        data.clientSubscriptionId = selectedLicense?.subscriptionId;
        data.tax = data.taxType == 'hst' ? hstAmount.fee : data.tax;
        if (contract !== '') {
            data.inCorporationDocumentUrl = `${contract.cdnUrl} ${contract.name}`;
        }
        data.isEligibleForLeave = convertYesNo(data?.isEligibleForLeave);
        data.enableFinancials = convertYesNo(data?.enableFinancials) as any;
        data.hasRollOverLeave = convertYesNo(data?.hasRollOverLeave);
        data.hasUtilizeLeaveDaysToDate = convertYesNo(
            data?.hasUtilizeLeaveDaysToDate,
        );

        // data.clientId = !clientType ? user?.superAdminId : data.clientId;
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
                // router.replace(router.asPath);
                router.reload();
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (err: any) {
            toast({
                title: err?.message || err?.body?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const show = router.asPath.startsWith('/client/team-members');
    //

    useLeavePageConfirmation(isDirty && !isSubmitting);

    const role = user?.role.replaceAll(' ', '');

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

    const paymentPartnerCurrency = paymentPartner?.find(
        (x) => x.id === watch('paymentPartnerId'),
    )?.currency;

    useEffect(() => {
        setValue(
            'departments',
            selectedDepartment.map((x) => x.id),
        );
    }, [selectedDepartment]);

    console.log({ userProfile, clients });

    // console.log({ fee: watch('dateOfBirth'), fin: watch('enableFinancials') });
    return (
        <>
            {/* {!userProfile?.isActive && role?.includes('Admin') && (
                <ActivateUserAlert
                    title="Activate Account!"
                    desc="This user needs your approval to be onboarded"
                    link={false}
                    btn="Activate"
                    loading={loading}
                    onClick={ActivateUserProfile}
                />
            )} */}
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                minH="80vh"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <Flex
                    justify="space-between"
                    align="center"
                    mb="1rem"
                    pb="1rem"
                    borderBottom="1px solid"
                    borderColor="gray.300"
                >
                    <Text
                        textTransform="uppercase"
                        mb="0"
                        fontSize="1.3rem"
                        fontWeight="500"
                    >
                        Personal Data
                    </Text>
                </Flex>
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
                            defaultValue={''}
                            register={register}
                        />
                        <PrimaryInput<TeamMemberModel>
                            label="Last Name"
                            name="lastName"
                            error={errors.lastName}
                            placeholder=""
                            defaultValue={''}
                            register={register}
                        />
                        <PrimaryInput<TeamMemberModel>
                            label="Email"
                            name="email"
                            error={errors.email}
                            placeholder=""
                            defaultValue={''}
                            disableLabel={true}
                            register={register}
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
                            ).format('YYYY/MM/DD')}
                            max={new DateObject().subtract(1, 'days')}
                            required={false}
                        />
                        <PrimarySelect<TeamMemberModel>
                            register={register}
                            error={errors.isActive}
                            name="isActive"
                            label="Profile Status"
                            placeholder={'Please select'}
                            options={
                                <>
                                    {[
                                        { id: true, label: 'Active' },
                                        { id: false, label: 'Not Active' },
                                    ].map((x) => (
                                        <option value={x.id as any}>
                                            {x.label}
                                        </option>
                                    ))}
                                </>
                            }
                        />
                    </Grid>
                    <Box mt="1rem">
                        <PrimaryInput<TeamMemberModel>
                            label="Address"
                            name="address"
                            error={errors.address}
                            placeholder=""
                            defaultValue={''}
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
                            <PrimarySelect<TeamMemberModel>
                                register={register}
                                error={errors.clientId}
                                name="clientId"
                                label="Current Client"
                                placeholder={'Please select'}
                                disabled={true}
                                options={
                                    <>
                                        {clients?.map((x) => (
                                            <option value={x.id}>
                                                {x?.organizationName ||
                                                    x?.fullName}
                                            </option>
                                        ))}
                                    </>
                                }
                            />
                            <PrimarySelect<TeamMemberModel>
                                register={register}
                                error={errors.supervisorId}
                                name="supervisorId"
                                label="Supervisor"
                                placeholder={'Please select'}
                                options={
                                    <>
                                        {supervisor.map((x) => (
                                            <option value={x.id}>
                                                {x.fullName}
                                            </option>
                                        ))}
                                    </>
                                }
                            />

                            <SelectBlank
                                label="Role"
                                placeholder={'Please select'}
                                onChange={(e) => changeUserRole(e.target.value)}
                                options={
                                    <>
                                        {[
                                            'Team Member',
                                            'Internal Supervisor',
                                            'Internal Admin',
                                            'Internal Payroll Manager',
                                        ].map((x) => (
                                            <option value={x} key={x}>
                                                {x}
                                            </option>
                                        ))}
                                    </>
                                }
                                value={watch('role')}
                            />

                            <Box pos="relative">
                                <PrimarySelect<TeamMemberModel>
                                    register={register}
                                    error={errors.employeeType}
                                    name="employeeType"
                                    label="Employee Category"
                                    placeholder={'Please select'}
                                    options={
                                        <>
                                            {[
                                                {
                                                    id: 'regular',
                                                    label: 'Regular',
                                                },
                                                {
                                                    id: 'shift',
                                                    label: 'Shift',
                                                },
                                            ].map((x) => (
                                                <option value={x.id}>
                                                    {x.label}
                                                </option>
                                            ))}
                                        </>
                                    }
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
                                defaultValue={''}
                                register={register}
                            />

                            <PrimarySelect<TeamMemberModel>
                                register={register}
                                error={errors.timesheetFrequency}
                                name="timesheetFrequency"
                                label="Timesheet Frequency"
                                placeholder={'Please select'}
                                options={
                                    <>
                                        {['Weekly', 'Bi-weekly', 'Monthly'].map(
                                            (x) => (
                                                <option value={x}>{x}</option>
                                            ),
                                        )}
                                    </>
                                }
                            />
                            <Box w="full">
                                <FormLabel
                                    textTransform="capitalize"
                                    width="fit-content"
                                    fontSize=".8rem"
                                >
                                    Department
                                </FormLabel>

                                <CustomSelectBox
                                    data={department}
                                    updateFunction={addDepartment}
                                    items={selectedDepartment}
                                    customKeys={{
                                        key: 'id',
                                        label: 'name',
                                    }}
                                    checkbox={true}
                                    id="users"
                                    error={errors?.departments}
                                    removeFn={removeDepartment}
                                    // single
                                />
                            </Box>
                            {/* <PrimarySelect<TeamMemberModel>
                                register={register}
                                error={errors.department}
                                name="department"
                                label="Department"
                                placeholder="Department"
                                options={
                                    <>
                                        {department.map((x) => (
                                            <option value={x?.name}>
                                                {x.name}
                                            </option>
                                        ))}
                                    </>
                                }
                            /> */}
                            <PrimarySelect<TeamMemberModel>
                                register={register}
                                error={errors.enableFinancials}
                                name="enableFinancials"
                                label="Is Payroll Required"
                                placeholder={'Please select'}
                                options={
                                    <>
                                        {[
                                            { id: true, label: 'Yes' },
                                            { id: false, label: 'No' },
                                        ].map((x) => (
                                            <option value={x.id as any}>
                                                {x.label}
                                            </option>
                                        ))}
                                    </>
                                }
                            />
                            <PrimarySelect<TeamMemberModel>
                                register={register}
                                error={errors.employmentContractType}
                                name="employmentContractType"
                                label="Employment Type"
                                placeholder={'Please select'}
                                options={
                                    <>
                                        {[
                                            'Contract',
                                            'Full time',
                                            'Part time',
                                        ].map((x) => (
                                            <option value={x}>{x}</option>
                                        ))}
                                    </>
                                }
                            />
                            <Box>
                                <UploadCareWidget
                                    refs={widgetApi}
                                    label="Attach Document"
                                    filename={
                                        contract?.name ||
                                        getFileName(
                                            userProfile?.employeeInformation
                                                ?.inCorporationDocumentUrl,
                                        )
                                    }
                                    loading={showLoading}
                                    uploadFunction={showLoadingState}
                                />
                            </Box>
                        </Grid>
                    </Box>
                    {role !== 'client' && (
                        <Box borderY="1px solid #d9d9d9" py="1rem" my="2rem">
                            <Text
                                fontWeight="600"
                                fontSize="1.1rem"
                                mb="1rem"
                                textTransform="capitalize"
                                color="brand.200"
                            >
                                License Plan Assigned
                            </Text>
                            <LicenseEditBox
                                data={subs}
                                updateFunction={addLicense}
                                items={selectedLicense}
                                customKeys={{
                                    key: 'subscriptionId',
                                    label: 'subscriptionType',
                                    used: 'noOfLicenceUsed',
                                    total: 'noOfLicensePurchased',
                                }}
                                removeFn={removeLicense}
                                id="assignLicense"
                                extraField={
                                    'users in total assigned to this license'
                                }
                                checkbox
                            />
                            <LicenseRevoke
                                userId={userProfile?.id}
                                text="Revoke License"
                                disabled={!curentLicense}
                                setSelectedLicense={setSelectedLicense}
                            />
                        </Box>
                    )}
                    {(includePayroll ||
                        (includePayroll as unknown as string) == 'Yes') && (
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
                                <PrimarySelect<TeamMemberModel>
                                    register={register}
                                    error={errors.payrollStructure}
                                    name="payrollStructure"
                                    label="Payroll Structure "
                                    placeholder="Please Select"
                                    options={
                                        <>
                                            {[
                                                {
                                                    id: 'flat',
                                                    name: 'flat fee',
                                                },
                                                {
                                                    id: 'inc',
                                                    name: 'incoporation',
                                                },
                                            ].map((x) => (
                                                <option value={x.id}>
                                                    {x.name}
                                                </option>
                                            ))}
                                        </>
                                    }
                                />
                                {isFlatFeeSelected && (
                                    <PrimaryInput<TeamMemberModel>
                                        label="Salary"
                                        name="rate"
                                        error={errors.rate}
                                        placeholder=""
                                        defaultValue=""
                                        register={register}
                                    />
                                )}
                                {isIncSelected && (
                                    <>
                                        <PrimaryInput<TeamMemberModel>
                                            label="Rate"
                                            name="rate"
                                            error={errors.rate}
                                            placeholder=""
                                            defaultValue=""
                                            register={register}
                                        />
                                        <PrimarySelect<TeamMemberModel>
                                            register={register}
                                            error={errors.rateType}
                                            name="rateType"
                                            label="Rate Type"
                                            placeholder="Please Select"
                                            options={
                                                <>
                                                    {[
                                                        'hourly',
                                                        'daily',
                                                        'weekly',
                                                    ].map((x) => (
                                                        <option value={x}>
                                                            {x}
                                                        </option>
                                                    ))}
                                                </>
                                            }
                                        />
                                    </>
                                )}
                                <PrimarySelect<TeamMemberModel>
                                    register={register}
                                    error={errors.paymentFrequency}
                                    name="paymentFrequency"
                                    label="Payroll Frequency "
                                    placeholder="Please Select"
                                    options={
                                        <>
                                            {[
                                                'Weekly',
                                                'Bi-weekly',
                                                'Monthly',
                                            ].map((x) => (
                                                <option value={x}>{x}</option>
                                            ))}
                                        </>
                                    }
                                />
                                <PrimarySelect<TeamMemberModel>
                                    register={register}
                                    error={errors.currency}
                                    name="currency"
                                    label="Currency"
                                    placeholder="Currency"
                                    options={
                                        <>
                                            {uniqueItems
                                                ?.sort((a, b) =>
                                                    a?.currency?.localeCompare(
                                                        b?.currency,
                                                    ),
                                                )
                                                .map((x) => (
                                                    <option value={x?.currency}>
                                                        {x?.currency} (
                                                        {getCurrencyName(
                                                            x?.currency,
                                                        ) || x?.name}
                                                        )
                                                    </option>
                                                ))}
                                        </>
                                    }
                                />
                                <PrimarySelect<TeamMemberModel>
                                    register={register}
                                    error={errors.taxType}
                                    name="taxType"
                                    label="Tax %"
                                    placeholder="Please Select"
                                    options={
                                        <>
                                            {['hst', 'custom', 'exempt'].map(
                                                (x) => (
                                                    <option value={x}>
                                                        {x}
                                                    </option>
                                                ),
                                            )}
                                        </>
                                    }
                                />
                                {taxType == 'custom' && (
                                    <PrimaryInput<TeamMemberModel>
                                        label="Custom Tax"
                                        name="tax"
                                        error={errors.tax}
                                        placeholder=""
                                        defaultValue=""
                                        register={register}
                                    />
                                )}

                                <PrimarySelect<TeamMemberModel>
                                    register={register}
                                    error={errors.payrollProcessingType}
                                    name="payrollProcessingType"
                                    label="Payroll Processing"
                                    placeholder="Please Select"
                                    options={
                                        <>
                                            {[
                                                'internal',
                                                'payment partner',
                                            ].map((x) => (
                                                <option value={x}>{x}</option>
                                            ))}
                                        </>
                                    }
                                />
                                {isPaymentPartnerSelected && (
                                    <>
                                        <PrimarySelect<TeamMemberModel>
                                            register={register}
                                            error={errors.paymentPartnerId}
                                            name="paymentPartnerId"
                                            label="Choose payment partner"
                                            placeholder="Please Select"
                                            options={
                                                <>
                                                    {paymentPartner.map((x) => (
                                                        <option value={x.id}>
                                                            {x.fullName}
                                                        </option>
                                                    ))}
                                                </>
                                            }
                                        />
                                        <PrimarySelect<TeamMemberModel>
                                            register={register}
                                            error={
                                                errors.paymentProcessingFeeType
                                            }
                                            name="paymentProcessingFeeType"
                                            label="Processing fee Type"
                                            placeholder={
                                                // ((userProfile
                                                //     ?.employeeInformation
                                                //     ?.paymentProcessingFeeType as unknown as string) ==
                                                // 'percentage'
                                                //     ? 'Percentage'
                                                //     : 'Flat Fee') ||
                                                'Please Select'
                                            }
                                            options={
                                                <>
                                                    {getUniqueListBy(
                                                        payFees || [],
                                                        'onboardingFeeType',
                                                    )?.map((x) => (
                                                        <option
                                                            value={
                                                                x.onboardingFeeType
                                                            }
                                                        >
                                                            {x.onboardingFeeType ==
                                                            'percentage'
                                                                ? 'Percentage'
                                                                : 'Flat fee '}
                                                        </option>
                                                    ))}
                                                </>
                                            }
                                        />
                                        <PrimarySelect<TeamMemberModel>
                                            register={register}
                                            error={errors.paymentProcessingFee}
                                            name="paymentProcessingFee"
                                            label={`Processing fee ${
                                                watch(
                                                    'paymentProcessingFeeType',
                                                ) == 'percentage'
                                                    ? '(%)'
                                                    : `(${paymentPartnerCurrency})`
                                            }`}
                                            placeholder={
                                                // (userProfile
                                                //     ?.employeeInformation
                                                //     ?.paymentProcessingFee as unknown as string) ||
                                                'Please Select'
                                            }
                                            options={
                                                <>
                                                    {payFees
                                                        ?.filter(
                                                            (x) =>
                                                                x.onboardingFeeType ==
                                                                watch(
                                                                    'paymentProcessingFeeType',
                                                                ),
                                                        )
                                                        .map((x) => (
                                                            <option
                                                                value={x.fee}
                                                            >
                                                                {x.fee}
                                                            </option>
                                                        ))}
                                                </>
                                            }
                                        />
                                    </>
                                )}
                                <PrimarySelect<TeamMemberModel>
                                    register={register}
                                    error={errors.invoiceGenerationType}
                                    name="invoiceGenerationType"
                                    label="Payment Type"
                                    placeholder={''}
                                    options={
                                        <>
                                            {['invoice', 'payroll'].map((x) => (
                                                <option value={x}>{x}</option>
                                            ))}
                                        </>
                                    }
                                />
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
                                Leave Management
                            </Text>
                        </Flex>

                        <Grid
                            templateColumns={['repeat(1,1fr)', 'repeat(3,1fr)']}
                            gap="1rem 2rem"
                        >
                            <Box mb="1.5rem" pos="relative">
                                <PrimaryRadio
                                    label="Is this team member eligible for leave?"
                                    radios={['No', 'Yes']}
                                    name="isEligibleForLeave"
                                    control={control}
                                    error={errors.isEligibleForLeave}
                                    defaultValue={
                                        convertYesNo(isEligibleForLeave) == true
                                            ? 'Yes'
                                            : 'No'
                                    }
                                />
                            </Box>

                            {convertYesNo(isEligibleForLeave) && (
                                <>
                                    {/* <PrimaryInput<TeamMemberModel>
                                        label="Eligible number of days"
                                        name="numberOfDaysEligible"
                                        error={errors.numberOfDaysEligible}
                                        placeholder=""
                                        defaultValue={''}
                                        register={register}
                                    /> */}

                                    <PrimaryInput<TeamMemberModel>
                                        label="Eligible number of hours"
                                        name="numberOfDaysEligible"
                                        error={errors.numberOfDaysEligible}
                                        placeholder=""
                                        defaultValue={
                                            userProfile?.employeeInformation
                                                ?.numberOfDaysEligible
                                        }
                                        register={register}
                                    />
                                    <Box />
                                </>
                            )}
                        </Grid>
                        <>
                            {convertYesNo(isEligibleForLeave) && (
                                <>
                                    <Grid
                                        templateColumns={[
                                            'repeat(1,1fr)',
                                            'repeat(3,1fr)',
                                        ]}
                                        gap="1rem 2rem"
                                        my="1rem"
                                    >
                                        <Box mb="1.5rem" pos="relative">
                                            <PrimaryRadio
                                                label="Does this team member have a rolled over leave?"
                                                radios={['No', 'Yes']}
                                                name="hasRollOverLeave"
                                                control={control}
                                                error={errors.hasRollOverLeave}
                                                defaultValue={
                                                    convertYesNo(
                                                        hasRolledOverLeave,
                                                    ) == true
                                                        ? 'Yes'
                                                        : 'No'
                                                }
                                            />
                                        </Box>

                                        {convertYesNo(hasRolledOverLeave) && (
                                            <PrimaryInput<TeamMemberModel>
                                                label="Rolled Over Leave"
                                                name="rolledOverLeave"
                                                error={errors.rolledOverLeave}
                                                placeholder=""
                                                defaultValue={
                                                    userProfile
                                                        ?.employeeInformation
                                                        ?.rolledOverLeave
                                                }
                                                register={register}
                                            />
                                        )}
                                        {convertYesNo(hasRolledOverLeave) && (
                                            <PrimaryDate<TeamMemberModel>
                                                label="Expiry date of rolled over leave"
                                                name="expiryDateOfRolledOverLeave"
                                                error={
                                                    errors.expiryDateOfRolledOverLeave
                                                }
                                                placeholder=""
                                                defaultValue={moment(
                                                    userProfile
                                                        ?.employeeInformation
                                                        ?.expiryDateOfRolledOverLeave,
                                                ).format('YYYY/MM/DD')}
                                                control={control}
                                                // register={register}
                                            />
                                        )}
                                    </Grid>
                                    <Grid
                                        templateColumns={[
                                            'repeat(1,1fr)',
                                            'repeat(3,1fr)',
                                        ]}
                                        gap="1rem 2rem"
                                    >
                                        <Box mb="1.5rem" pos="relative">
                                            <PrimaryRadio
                                                label="Has this team member utilized any leave Hours to date?"
                                                radios={['No', 'Yes']}
                                                name="hasUtilizeLeaveDaysToDate"
                                                control={control}
                                                error={
                                                    errors.hasUtilizeLeaveDaysToDate
                                                }
                                                defaultValue={
                                                    convertYesNo(
                                                        hasUtilizeLeaveDaysToDate,
                                                    ) == true
                                                        ? 'Yes'
                                                        : 'No'
                                                }
                                            />
                                        </Box>

                                        {convertYesNo(
                                            hasUtilizeLeaveDaysToDate,
                                        ) && (
                                            <PrimaryInput<TeamMemberModel>
                                                label="Utilized Leave (hours)"
                                                name="utilizedLeave"
                                                error={errors.utilizedLeave}
                                                placeholder=""
                                                defaultValue={
                                                    userProfile
                                                        ?.employeeInformation
                                                        ?.utilizedLeave
                                                }
                                                register={register}
                                                suffix={
                                                    <InputRightElement right="1rem">
                                                        <Text fontSize=".8rem">
                                                            hours
                                                        </Text>
                                                    </InputRightElement>
                                                }
                                            />
                                        )}
                                    </Grid>
                                </>
                            )}
                        </>
                    </Box>
                    {convertYesNo(isEligibleForLeave) && (
                        <Box mt="5">
                            {/* <Heading
                            fontSize={13}
                            mb="12px"
                            color="#1A202C"
                            fontWeight={500}
                        >
                            Team member leave balance
                        </Heading> */}
                            <Box w="266px">
                                <InputBlank
                                    label="Team member leave balance"
                                    placeholder=""
                                    defaultValue=""
                                    readonly={true}
                                    disableLabel={true}
                                    value={`${userProfile?.employeeInformation?.numberOfDaysEligible} hours`}
                                />
                            </Box>
                        </Box>
                    )}
                    <ContractTable
                        userProfile={userProfile}
                        isSuperAdmin={isSuperAdmin}
                    />
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
                    {!show && role !== 'client' && (
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
                    prev={watch('role')}
                />
            </Box>
        </>
    );
}

export default TeamProfile;
