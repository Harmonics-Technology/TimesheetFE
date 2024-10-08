import {
    Grid,
    Box,
    useToast,
    Text,
    useRadioGroup,
    HStack,
    Button,
    DrawerFooter,
    FormLabel,
    Icon,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { DateObject } from 'react-multi-date-picker';
import {
    DraftService,
    OnboardingFeeService,
    TeamMemberModel,
    UserDraftModel,
    UserService,
} from 'src/services';
import DrawerWrapper from '../Drawer';
import Loading from '../Loading';
import { PrimaryDate } from '../PrimaryDate';
import { PrimaryInput } from '../PrimaryInput';
import { PrimaryPhoneInput } from '../PrimaryPhoneInput';
import { SectionTitle } from './SectionTitle';
import { PrimarySelect } from '../PrimarySelect';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { LicenseSelection } from '@components/subpages/ManageSub/LicenseSelection';
import RadioBtn from '../RadioBtn';
import { PrimaryRadio } from '../PrimaryRadio';
import { getUniqueListBy } from '@components/generics/functions/getUniqueList';
import { getCurrencyName } from '@components/generics/functions/getCurrencyName';
import BeatLoader from 'react-spinners/BeatLoader';
import { RiMailSendFill } from 'react-icons/ri';
import { ShowPrompt } from '../ProjectManagement/Modals/ShowPrompt';
import UploadCareWidget from '../UploadCareWidget';
import { OnboardingFeeContext } from '@components/context/OnboardingFeeContext';
import { CustomSelectBox } from '../ProjectManagement/Generics/CustomSelectBox';
import { BsFillInfoSquareFill } from 'react-icons/bs';

export const NewTeamMemerOnboardingForm = ({
    isOpen,
    onClose,
    department,
    subs,
    client,
    currencies,
    paymentPartner,
    leaveSettings,
    router,
    user,
    openDraft,
    closeDraft,
    onOpenDraft,
}) => {
    const [supervisors, setSupervisors] = useState<any>();
    const [payFees, setPayFees] = useState<any>();
    const [loading, setLoading] = useState<any>();
    const toast = useToast();
    const { hstAmount } = useContext(OnboardingFeeContext);

    // const schema = yup.object().shape({
    //     lastName: yup.string().required(),
    //     firstName: yup.string().required(),
    //     email: yup.string().email().required(),
    //     phoneNumber: yup.string().required(),
    //     jobTitle: yup.string().required(),
    //     // clientId: yup.string().required(),
    //     supervisorId: yup.string().required(),
    //     isActive: yup.boolean().required(),
    //     hoursPerDay: yup.number().required(),
    //     payRollTypeId: yup.number().when('enableFinancials', {
    //         is: true,
    //         then: yup.number().required(),
    //     }),
    //     paymentPartnerId: yup.string().when('enableFinancials', {
    //         is: true,
    //         then: yup.string().nullable().when('payRollTypeId', {
    //             is: 2,
    //             then: yup.string().required(),
    //         }),
    //     }),
    //     ratePerHour: yup.string().when('enableFinancials', {
    //         is: true,
    //         then: yup.string().nullable().when('payRollTypeId', {
    //             is: 1,
    //             then: yup.string().required(),
    //         }),
    //     }),
    //     hstNumber: yup.number().when('enableFinancials', {
    //         is: true,
    //         then: yup.number().nullable().when('payRollTypeId', {
    //             is: 1,
    //             then: yup.number().required(),
    //         }),
    //     }),
    //     monthlyPayoutRate: yup.string().when('enableFinancials', {
    //         is: true,
    //         then: yup.string().nullable().when('payRollTypeId', {
    //             is: 2,
    //             then: yup.string().required(),
    //         }),
    //     }),
    //     currency: yup.string().required(),
    //     // paymentRate: yup.string().required(),
    //     fixedAmount: yup.boolean().when('enableFinancials', {
    //         is: true,
    //         then: yup.boolean().required(),
    //     }),
    //     title: yup.string().required(),
    //     startDate: yup.string().required(),
    //     endDate: yup.string().required(),
    //     dateOfBirth: yup.string().required(),
    //     paymentFrequency: yup.string().required(),
    //     address: yup.string().required(),
    //     clientRate: yup.string().when('enableFinancials', {
    //         is: true,
    //         then: yup.string().required(),
    //     }),
    //     // timeSheetGenerationStartDate: yup.string().required(),
    //     isEligibleForLeave: yup.string().required(),
    //     employeeType: yup.string().required(),
    //     numberOfDaysEligible: yup
    //         .string()
    //         .nullable()
    //         .when('isEligibleForLeave', {
    //             is: 'Yes' || true,
    //             then: yup.string().required(),
    //         }),
    //     numberOfHoursEligible: yup
    //         .string()
    //         .nullable()
    //         .when('isEligibleForLeave', {
    //             is: 'Yes' || true,
    //             then: yup.string().required(),
    //         }),
    //     onBoradingFee: yup.string().when('fixedAmount', {
    //         is: false,
    //         then: yup.string().required(),
    //     }),
    //     hasRolledOverLeave: yup.string().required('Please select an option'),

    // });
    const draftSchema = yup.object().shape({});

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<TeamMemberModel>({
        // resolver: yupResolver(openDraft ? draftSchema : schema),
        mode: 'all',
        defaultValues: {
            numberOfDaysEligible: leaveSettings?.eligibleLeaveDays || '',
            role: 'Team Member',
        },
    });

    const [selectedLicense, setSelectedLicense] = useState<any>();
    const addLicense = (license) => {
        setSelectedLicense(license);
    };
    const removeLicense = (id) => {
        setSelectedLicense(undefined);
    };

    const clientId = watch('clientId') || user?.superAdminId;
    const paymentPartnerId = watch('paymentPartnerId');
    const getSupervisor = async (id) => {
        if (id === undefined) {
            return;
        }
        setLoading(true);

        try {
            const data = await UserService.listSupervisorsAndAdmins(id);
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
    //

    const isFlatFeeSelected = watch('payrollStructure') == 'flat';
    const isIncSelected = watch('payrollStructure') == 'inc';
    const isPaymentPartnerSelected =
        watch('payrollProcessingType') == 'payment partner';
    const payData = watch('enableFinancials');

    const taxType = watch('taxType');
    const uniqueItems = getUniqueListBy(currencies, 'currency');
    const isEligibleForLeave = watch('isEligibleForLeave');
    const hasRolledOverLeave = watch('hasRollOverLeave');
    const hasUtilizeLeaveDaysToDate = watch('hasUtilizeLeaveDaysToDate');

    const [clientType, setClientType] = useState(false);
    const [contract, setContractFile] = useState<any>('');
    const [showLoading, setShowLoading] = useState(false);
    const widgetApi = useRef<any>();

    const radious = ['For me', 'For my client'];
    const { getRootProps: rootProps, getRadioProps: radioProps } =
        useRadioGroup({
            name: 'selection',
            defaultValue: 'For me',
            onChange: (value) => updateClientFields(value),
        });

    const updateClientFields = (value: any) => {
        if (value == 'For me') {
            setClientType(false);
        } else {
            setClientType(true);
        }
    };

    const groups = rootProps();

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

    const userFirstName = watch('firstName');
    const userLastName = watch('lastName');
    const userEmail = watch('email');
    const closeModal = () => {
        if (userFirstName && userLastName && userEmail) {
            // onClose();
            onOpenDraft();
        } else {
            onClose();
        }
    };
    const doClose = () => {
        onClose();
        closeDraft();
    };

    useEffect(() => {
        getSupervisor(clientId);
    }, [clientId]);
    useEffect(() => {
        getPaymentPartnerFees(paymentPartnerId);
    }, [paymentPartnerId]);

    const [selectedDepartment, setSelectedDepartment] = useState<any>([]);
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

    // console.log({ errors });

    const onSubmit = async (data: TeamMemberModel) => {
        data.tax = data.taxType == 'hst' ? hstAmount.fee : data.tax;
        data.superAdminId = user?.superAdminId;
        data.payRollTypeId = 2;
        data.clientSubscriptionId = selectedLicense?.subscriptionId;
        if (contract !== '') {
            data.inCorporationDocumentUrl = `${contract.cdnUrl} ${contract.name}`;
        }
        data.isEligibleForLeave =
            (data?.isEligibleForLeave as any) == 'Yes' ? true : false;
        data.enableFinancials =
            (data?.enableFinancials as any) == 'Yes' ? true : false;
        data.hasRollOverLeave =
            (data?.hasRollOverLeave as any) == 'Yes' ? true : false;
        data.hasUtilizeLeaveDaysToDate =
            (data?.hasUtilizeLeaveDaysToDate as any) == 'Yes' ? true : false;

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
                reset();
                setContractFile({});
                onClose();
                router.replace(router.asPath);
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

    const saveToDraft = async (data: TeamMemberModel) => {
        // data.tax = data.taxType == 'hst' ? hstAmount.fee : data.tax || 0;
        data.superAdminId = user?.superAdminId;
        data.payRollTypeId = 2;
        data.clientSubscriptionId = selectedLicense?.subscriptionId;

        if (contract !== '') {
            data.inCorporationDocumentUrl = `${contract.cdnUrl} ${contract.name}`;
        }
        data.isEligibleForLeave =
            (data?.isEligibleForLeave as any) == 'Yes' ? true : false;
        data.enableFinancials =
            (data?.enableFinancials as any) == 'Yes' ? true : false;
        data.hasRollOverLeave =
            (data?.hasRollOverLeave as any) == 'Yes' ? true : false;
        data.hasUtilizeLeaveDaysToDate =
            (data?.hasUtilizeLeaveDaysToDate as any) == 'Yes' ? true : false;

        data.clientId = !clientType ? user?.superAdminId : data.clientId;
        try {
            const result = await DraftService.createDraft(
                data as UserDraftModel,
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

    const taxes = isIncSelected ? ['hst'] : ['hst', 'custom', 'exempt'];

    useEffect(() => {
        setValue(
            'departments',
            selectedDepartment.map((x) => x.id),
        );
    }, [selectedDepartment]);

    return (
        <DrawerWrapper
            onClose={closeModal}
            isOpen={isOpen}
            title={'Add a new Team Member'}
        >
            <Loading loading={loading} />
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid
                    templateColumns={['repeat(1,1fr)', 'repeat(2,1fr)']}
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
                        label="Date of Birth (Optional)"
                        error={errors.dateOfBirth}
                        max={new DateObject().subtract(1, 'days')}
                        required={false}
                    />
                    <PrimaryInput<TeamMemberModel>
                        label="Address"
                        name="address"
                        error={errors.address}
                        placeholder=""
                        defaultValue=""
                        register={register}
                    />
                </Grid>
                <Box w="full">
                    <SectionTitle text="Work Data" />
                    <Box mb="1.5rem">
                        <Text fontWeight="500" mb=".5rem" fontSize=".9rem">
                            Is this team member for you or for a client you
                            manage?
                        </Text>
                        <HStack
                            w="full"
                            {...groups}
                            defaultValue={'For my client'}
                        >
                            {radious.map((value) => {
                                const radio = radioProps({
                                    value,
                                });
                                return <RadioBtn {...radio}>{value}</RadioBtn>;
                            })}
                        </HStack>
                    </Box>
                    <Grid
                        templateColumns={['repeat(1,1fr)', 'repeat(2,1fr)']}
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
                        {clientType && (
                            <PrimarySelect<TeamMemberModel>
                                register={register}
                                error={errors.clientId}
                                name="clientId"
                                label="Client"
                                placeholder="Client"
                                options={
                                    <>
                                        {client.map((x) => (
                                            <option value={x?.id}>
                                                {x.organizationName}
                                            </option>
                                        ))}
                                    </>
                                }
                            />
                        )}
                        <PrimarySelect<TeamMemberModel>
                            register={register}
                            error={errors.supervisorId}
                            name="supervisorId"
                            label="Supervisor"
                            placeholder="Supervisor"
                            options={
                                <>
                                    {supervisors?.map((x) => (
                                        <option value={x?.id}>
                                            {x.fullName}
                                        </option>
                                    ))}
                                </>
                            }
                        />
                        {/* </Grid>
                    <Grid
                        templateColumns={['repeat(1,1fr)', 'repeat(2,1fr)']}
                        gap="1rem 2rem"
                        minW="0"
                    > */}
                        <PrimaryDate<TeamMemberModel>
                            control={control}
                            name="startDate"
                            label="Start Date"
                            error={errors.startDate}
                            required={false}
                            // min={new Date()}
                        />
                        <PrimaryDate<TeamMemberModel>
                            control={control}
                            name="endDate"
                            label="End Date"
                            error={errors.endDate}
                            min={new DateObject().add(3, 'days')}
                            required={false}
                        />
                        <PrimarySelect<TeamMemberModel>
                            register={register}
                            error={errors.employmentContractType}
                            name="employmentContractType"
                            label="Employment Type"
                            placeholder="Please select"
                            options={
                                <>
                                    {['Contract', 'Full time', 'Part time'].map(
                                        (x) => (
                                            <option value={x}>{x}</option>
                                        ),
                                    )}
                                </>
                            }
                        />
                        <PrimarySelect<TeamMemberModel>
                            register={register}
                            error={errors.employeeType}
                            name="employeeType"
                            label="Employment Category"
                            placeholder="Please Select"
                            options={
                                <>
                                    {['regular', 'shift'].map((x) => (
                                        <option value={x}>{x}</option>
                                    ))}
                                </>
                            }
                        />
                        <PrimaryInput<TeamMemberModel>
                            label="Hours per day"
                            name="hoursPerDay"
                            error={errors.hoursPerDay}
                            placeholder=""
                            defaultValue=""
                            type="number"
                            register={register}
                        />
                        <PrimarySelect<TeamMemberModel>
                            register={register}
                            error={errors.timesheetFrequency}
                            name="timesheetFrequency"
                            label="Timesheet Frequency"
                            placeholder="Please Select"
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
                        <LicenseSelection
                            addLicense={addLicense}
                            removeLicense={removeLicense}
                            errors={errors}
                            selectedLicense={selectedLicense}
                            subs={subs}
                        />
                    </Grid>
                    <Box mt="1rem">
                        <UploadCareWidget
                            refs={widgetApi}
                            label="Attach Document"
                            filename={contract?.name}
                            loading={showLoading}
                            uploadFunction={showLoadingState}
                        />
                    </Box>
                </Box>
                <Box w="full">
                    <SectionTitle text="Work Data" />
                    <Box mb="1.5rem">
                        <PrimaryRadio<TeamMemberModel>
                            label="Do you want to include Payroll data"
                            radios={['Yes', 'No']}
                            name="enableFinancials"
                            control={control}
                            error={errors.enableFinancials}
                            defaultValue={'No'}
                        />
                    </Box>
                    {payData && (payData as unknown as string) == 'Yes' && (
                        <Box>
                            <Box mb="1rem">
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
                            </Box>
                            <>
                                <Grid
                                    templateColumns={[
                                        'repeat(1,1fr)',
                                        'repeat(3,1fr)',
                                    ]}
                                    gap="1rem 2rem"
                                    minW="0"
                                >
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
                                                    <option value={x}>
                                                        {x}
                                                    </option>
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
                                        defaultValue={'CAD'}
                                        options={
                                            <>
                                                {uniqueItems
                                                    ?.sort((a, b) =>
                                                        a?.currency?.localeCompare(
                                                            b?.currency,
                                                        ),
                                                    )
                                                    .map((x) => (
                                                        <option
                                                            value={x?.currency}
                                                        >
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
                                                {taxes.map((x) => (
                                                    <option value={x}>
                                                        {x}
                                                    </option>
                                                ))}
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
                                                    <option value={x}>
                                                        {x}
                                                    </option>
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
                                                        {paymentPartner.map(
                                                            (x) => (
                                                                <option
                                                                    value={x.id}
                                                                >
                                                                    {x.fullName}
                                                                </option>
                                                            ),
                                                        )}
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
                                                placeholder="Please Select"
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
                                                error={
                                                    errors.paymentProcessingFee
                                                }
                                                name="paymentProcessingFee"
                                                label="Processing fee"
                                                placeholder="Please Select"
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
                                                                    value={
                                                                        x.fee
                                                                    }
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
                                        placeholder="Please Select"
                                        options={
                                            <>
                                                {['invoice', 'payroll'].map(
                                                    (x) => (
                                                        <option value={x}>
                                                            {x}
                                                        </option>
                                                    ),
                                                )}
                                            </>
                                        }
                                    />
                                </Grid>
                            </>
                        </Box>
                    )}
                </Box>
                <Box w="full">
                    <SectionTitle
                        text="Leave Management"
                        sub={
                            <HStack
                                bgColor="#f1f4f8"
                                p="6px 11px"
                                gap="8px"
                                color="#6A7F9D"
                                align="flex-start"
                            >
                                <Icon
                                    as={BsFillInfoSquareFill}
                                    fontSize="13px"
                                    mt="3px"
                                />
                                <Text fontSize="11px" fontWeight={400}>
                                    You can setup leave for your team member in
                                    the team members profile, it is not
                                    compulsory at onboarding stage
                                </Text>
                            </HStack>
                        }
                    />
                    <Box pos="relative" mb="1rem">
                        <PrimaryRadio<TeamMemberModel>
                            label="Is this team member eligible for leave?"
                            radios={['No', 'Yes']}
                            name="isEligibleForLeave"
                            control={control}
                            error={errors.isEligibleForLeave}
                            defaultValue={'No'}
                        />
                    </Box>
                    {(isEligibleForLeave as unknown as string) == 'Yes' && (
                        <>
                            <Grid
                                templateColumns={[
                                    'repeat(1,1fr)',
                                    'repeat(2,1fr)',
                                ]}
                                gap="1rem 2rem"
                                mb="1rem"
                            >
                                {/* <PrimaryInput<TeamMemberModel>
                                label="Eligible number of days"
                                name="numberOfDaysEligible"
                                error={errors.numberOfDaysEligible}
                                placeholder=""
                                defaultValue=""
                                register={register}
                                readonly={leaveSettings?.isStandardEligibleDays}
                            /> */}
                                <PrimaryInput<TeamMemberModel>
                                    label="Eligible number of hours"
                                    name="numberOfHoursEligible"
                                    error={errors.numberOfHoursEligible}
                                    placeholder=""
                                    defaultValue=""
                                    register={register}
                                />
                            </Grid>

                            <Box pos="relative" mb="1rem">
                                <PrimaryRadio<TeamMemberModel>
                                    label="Does this team member have a rolled over leave?"
                                    radios={['No', 'Yes']}
                                    name="hasRollOverLeave"
                                    control={control}
                                    error={errors.hasRollOverLeave}
                                    defaultValue={'No'}
                                />
                            </Box>
                            {(hasRolledOverLeave as unknown as string) ==
                                'Yes' && (
                                <Grid
                                    templateColumns={[
                                        'repeat(1,1fr)',
                                        'repeat(2,1fr)',
                                    ]}
                                    gap="1rem 2rem"
                                    mb="1rem"
                                >
                                    <PrimaryInput<TeamMemberModel>
                                        label="Rolled Over Leave"
                                        name="rolledOverLeave"
                                        error={errors.rolledOverLeave}
                                        placeholder=""
                                        defaultValue=""
                                        register={register}
                                        // readonly={leaveSettings?.isStandardEligibleDays}
                                    />
                                    <PrimaryDate<TeamMemberModel>
                                        label="Expiry date of rolled over leave"
                                        name="expiryDateOfRolledOverLeave"
                                        error={
                                            errors.expiryDateOfRolledOverLeave
                                        }
                                        placeholder=""
                                        defaultValue=""
                                        control={control}
                                        // register={register}
                                    />
                                </Grid>
                            )}
                            <Box pos="relative" mb="1rem">
                                <PrimaryRadio<TeamMemberModel>
                                    label="Has this team member utilized any leave Hours to date?"
                                    radios={['No', 'Yes']}
                                    name="hasUtilizeLeaveDaysToDate"
                                    control={control}
                                    error={errors.hasUtilizeLeaveDaysToDate}
                                    defaultValue={'No'}
                                />
                            </Box>
                            {(hasUtilizeLeaveDaysToDate as unknown as string) ==
                                'Yes' && (
                                <Grid
                                    templateColumns={[
                                        'repeat(1,1fr)',
                                        'repeat(2,1fr)',
                                    ]}
                                    gap="1rem 2rem"
                                >
                                    <PrimaryInput<TeamMemberModel>
                                        label="Utilized Leave"
                                        name="utilizedLeave"
                                        error={errors.utilizedLeave}
                                        placeholder=""
                                        defaultValue=""
                                        register={register}
                                        // readonly={leaveSettings?.isStandardEligibleDays}
                                    />
                                </Grid>
                            )}
                        </>
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

            {openDraft && (
                <ShowPrompt
                    isOpen={openDraft}
                    onClose={doClose}
                    onSubmit={handleSubmit(saveToDraft)}
                    loading={isSubmitting}
                    text={`Do you want to save as draft?`}
                />
            )}
        </DrawerWrapper>
    );
};
