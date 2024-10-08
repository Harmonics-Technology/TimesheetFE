import {
    Box,
    Flex,
    Text,
    Heading,
    Stack,
    Button,
    useToast,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { PrimaryRadio } from '@components/bits-utils/PrimaryRadio';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { LeaveConfigurationModel, LeaveService } from 'src/services';
import { LeaveConfigurationView } from 'src/services';
import { PrimarySelect } from '@components/bits-utils/PrimarySelect';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import { useState } from 'react';

const schema = yup.object().shape({});

interface leavesProps {
    leaveConfiguration?: LeaveConfigurationView;
}

const LeaveSettings = ({ leaveConfiguration }: leavesProps) => {
    const router = useRouter();
    const [addCustomPeriod, setAddCustomPeriod] = useState(false);
    const leaveconfig =
        leaveConfiguration?.isStandardEligibleDays == true ? 'Yes' : 'No';
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<LeaveConfigurationModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            eligibleLeaveDays: leaveConfiguration?.eligibleLeaveDays,
            id: leaveConfiguration?.id,
            isStandardEligibleDays: leaveConfiguration?.isStandardEligibleDays,
            superAdminId: leaveConfiguration?.superAdminId,
        },
    });

    const isProratedLeave = watch('isProrated');
    const allowRollover = watch('allowRollover');

    console.log({ leaveConfiguration });

    const toast = useToast();

    const onSubmit = async (data: LeaveConfigurationModel) => {
        data.allowRollover =
            (data.allowRollover as any) == 'Roll over unused leave days'
                ? true
                : false;
        data.isProrated = (data.isProrated as any) == 'Yes' ? true : false;
        data.noOfMonthValid = Number(data.noOfMonthValid);
        try {
            const result = await LeaveService.updateLeaveConfiguration(data);
            if (result.status) {
                toast({
                    title: `Successful`,
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
            return;
        } catch (err: any) {
            toast({
                title: err?.body?.message || err?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    return (
        <Box bg="#FFFFFF" boxShadow="md" px="18px" py="18px" borderRadius="8px">
            <Flex align="center" gap="19px">
                <Link href="/SuperAdmin/account-management/leave-management-settings">
                    <Text
                        fontSize=".875rem"
                        pb="8px"
                        fontWeight={500}
                        color={
                            router.pathname ===
                            '/SuperAdmin/account-management/leave-management-settings'
                                ? '#2EAFA3'
                                : '#2d3748'
                        }
                        mb="0"
                        borderBottom={
                            router.pathname ===
                            '/SuperAdmin/account-management/leave-management-settings'
                                ? '2px solid #2EAFA3'
                                : 'none'
                        }
                        cursor="pointer"
                    >
                        Leave Management Preference
                    </Text>
                </Link>
                <Link href="/SuperAdmin/account-management/leave-settings">
                    <Text
                        pb="8px"
                        fontSize=".875rem"
                        color={
                            router.pathname ===
                            '/SuperAdmin/account-management/leave-settings'
                                ? '#2EAFA3'
                                : '#2d3748'
                        }
                        mb="0"
                        fontWeight={500}
                        borderBottom={
                            router.pathname ===
                            '/SuperAdmin/account-management/leave-settings'
                                ? '2px solid #2EAFA3'
                                : 'none'
                        }
                        cursor="pointer"
                    >
                        Leave Settings
                    </Text>
                </Link>
            </Flex>
            <Box w="100%" h="1px" mb="13px" bg="#C2CFE0"></Box>
            <Box>
                <Stack
                    spacing="21px"
                    pb="19px"
                    borderBottom="1px solid #C2CFE0"
                >
                    <Box w="60%">
                        <Heading
                            fontSize={14}
                            fontWeight={500}
                            color="#1B1D21"
                            mb="8px"
                        >
                            Prorated Leave
                        </Heading>
                        <Text fontSize={14} color="#696969">
                            Prorated Leave refers to the proportional allocation
                            of annual leave based on an employee's period of
                            employment during a particular leave year. It
                            ensures that employees are granted a fair amount of
                            leave based on their time working for the company.
                        </Text>
                    </Box>
                    <Box w="60%">
                        <PrimaryRadio<LeaveConfigurationModel>
                            label="Is leave prorated in your organization or company"
                            radios={['Yes', 'No']}
                            name="isProrated"
                            control={control}
                            error={errors.isProrated}
                            defaultValue={leaveconfig}
                        />
                    </Box>
                </Stack>
                <Stack
                    spacing="16px"
                    pt="13px"
                    pb="63px"
                    borderBottom="1px solid #C2CFE0"
                >
                    <Box w="60%">
                        <Heading
                            fontSize={14}
                            fontWeight={500}
                            color="#1B1D21"
                            mb="8px"
                        >
                            Leave Rollover
                        </Heading>
                        <Text fontSize={14} color="#696969">
                            Leave Rollover refers to the practice of
                            transferring unused paid time off (PTO) from one
                            calendar year to the next. This policy allows
                            employees to carry over their unused leave days for
                            future use rather than losing them at the end of the
                            year.
                        </Text>
                    </Box>
                    <Box w="60%">
                        <PrimaryRadio<LeaveConfigurationModel>
                            label=""
                            radios={[
                                'Roll over unused leave days',
                                'Expire if leave not used',
                            ]}
                            name="allowRollover"
                            control={control}
                            error={errors.allowRollover}
                            defaultValue={''}
                            flexDir="column"
                            gap="14px"
                        />
                    </Box>
                    {(allowRollover as unknown as string) ==
                        'Roll over unused leave days' && (
                        <Box mt=".6rem">
                            <Text fontSize="14px" color="#1b1d21">
                                Select the period you like for a rolled over
                                leave to expire or add a custom period
                            </Text>
                            <Box w="30%">
                                {addCustomPeriod ? (
                                    <PrimaryInput<LeaveConfigurationModel>
                                        label=""
                                        name="noOfMonthValid"
                                        error={errors.noOfMonthValid}
                                        placeholder="Enter number of period in months"
                                        defaultValue=""
                                        register={register}
                                    />
                                ) : (
                                    <PrimarySelect<LeaveConfigurationModel>
                                        label=""
                                        name="noOfMonthValid"
                                        error={errors.noOfMonthValid}
                                        placeholder="3 Months"
                                        defaultValue=""
                                        register={register}
                                        options={
                                            <>
                                                {[
                                                    {
                                                        label: '3 Months',
                                                        id: 3,
                                                    },
                                                    {
                                                        label: '6 Months',
                                                        id: 6,
                                                    },
                                                    { label: 'Never', id: 0 },
                                                ]?.map((x: any) => (
                                                    <option value={x?.id}>
                                                        {x.label}
                                                    </option>
                                                ))}
                                            </>
                                        }
                                    />
                                )}
                            </Box>
                        </Box>
                    )}
                    {(allowRollover as unknown as string) ==
                        'Roll over unused leave days' && (
                        <Box w="150px">
                            <Button
                                color="#2EAFA3"
                                bg="none"
                                _hover={{ bg: 'none' }}
                                p="0"
                                fontSize={13}
                                fontWeight={600}
                                onClick={() =>
                                    setAddCustomPeriod(!addCustomPeriod)
                                }
                            >
                                {addCustomPeriod
                                    ? 'Select period'
                                    : 'Add Custom period'}
                            </Button>
                        </Box>
                    )}
                    {allowRollover && (
                        <Button
                            borderRadius="5px"
                            bg="#2EAFA3"
                            color="#ffffff"
                            fontSize={13}
                            fontWeight={500}
                            w="100px"
                            mt="2rem"
                            isLoading={isSubmitting}
                            onClick={handleSubmit(onSubmit)}
                        >
                            Save
                        </Button>
                    )}
                </Stack>
            </Box>
        </Box>
    );
};

export default LeaveSettings;
