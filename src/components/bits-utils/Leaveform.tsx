import {
    useToast,
    Flex,
    Grid,
    Checkbox,
    VStack,
    Box,
    DrawerFooter,
    Button,
    HStack,
    Text,
    InputRightElement,
} from '@chakra-ui/react';
import { UserContext } from '@components/context/UserContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { DateObject } from 'react-multi-date-picker';
import BeatLoader from 'react-spinners/BeatLoader';
import { LeaveModel, LeaveService } from 'src/services';
import { ActivateUserAlert } from './ActivateUserAlert';
import DrawerWrapper from './Drawer';
import getBusinessDateCount from './GetBusinessDays';
import { PrimaryDate } from './PrimaryDate';
import { PrimaryTextarea } from './PrimaryTextArea';
import { SelectrixBox } from './Selectrix';
import { IconPickerItem } from 'react-icons-picker';
import * as yup from 'yup';
import { LeaveTextBox } from './LeaveTextBox';
import { PrimaryInput } from './PrimaryInput';
import moment from 'moment';
import InputBlank from './InputBlank';

const schema = yup.object().shape({
    // endDate: yup.string().required(),
    startDate: yup.string().required(),
    leaveTypeId: yup.string().required(),
    reasonForLeave: yup.string().required(),
    workAssigneeId: yup.string().required(),
});

const Leaveform = ({
    data,
    isEdit,
    isOpen,
    onClose,
    id,
    leavetypes,
    teamMembers,
}) => {
    const { user } = useContext(UserContext);
    const router = useRouter();
    const toast = useToast();
    const [oneDay, setOneDay] = useState(false);
    const leaveDaysLeft =
        user?.numberOfDaysEligible != null && user?.numberOfDaysEligible != 0
            ? user?.numberOfDaysEligible
            : 0;

    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<LeaveModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            employeeInformationId: id,
            endDate: data?.endDate,
            startDate: data?.startDate,
            id: data?.id,
            leaveTypeId: data?.leaveTypeId,
            reasonForLeave: data?.reasonForLeave,
            workAssigneeId: data?.workAssigneeId,
        },
    });

    const [duration, setDuration] = useState();

    const leaveDays = getBusinessDateCount(
        new Date(watch('startDate') as unknown as Date),
        new Date(watch('endDate') as unknown as Date),
    );
    const leaveDuration = oneDay
        ? Number(duration)
        : leaveDays * Number(duration);
    const [showBalance, setShowBalance] = useState(false);

    // console.log({ user });

    const onSubmit = async (data: LeaveModel) => {
        // if (leaveDuration > leaveDaysLeft) {
        //     toast({
        //         title: 'You cannot apply for a leave duration greater than your leave balance',
        //         status: 'error',
        //         isClosable: true,
        //         position: 'top-right',
        //     });
        //     return;
        // }
        oneDay == true && (data.endDate = data.startDate);
        data.leaveTypeId =
            leavetypes.value?.filter((x) => x.name == data.leaveTypeId)[0]
                ?.id || data.leaveTypeId;
        data.noOfLeaveDaysApplied = leaveDuration;
        // console.log({data})

        try {
            const result = isEdit
                ? await LeaveService.updateLeave(data)
                : await LeaveService.createLeave(data);
            if (result.status) {
                toast({
                    title: result.message,
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
                title: err?.body?.message || err?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    // console.log({ teamMembers, id });

    return (
        <DrawerWrapper
            onClose={onClose}
            isOpen={isOpen}
            sub={
                <Box>
                    <Text fontWeight={700} color="#2d3748">
                        Leave Application
                    </Text>
                    <Text fontSize="14px" color="#77777a" fontWeight={400}>
                        Please fill the below form to apply
                    </Text>
                    <HStack justify="flex-end" mt="5px">
                        <LeaveTextBox
                            title="Leave Balance"
                            value={Math.floor(leaveDaysLeft)}
                            suffix="Hours"
                        />
                    </HStack>
                </Box>
            }
        >
            {/* <ActivateUserAlert
                desc={`PS: You have ${leaveDaysLeft} days free leave.`}
                color="warning"
            /> */}

            <form onSubmit={handleSubmit(onSubmit)}>
                <SelectrixBox<LeaveModel>
                    control={control}
                    name="leaveTypeId"
                    error={errors.leaveTypeId}
                    keys="name"
                    keyLabel="leaveTypeIcon"
                    label="Leave Type"
                    options={leavetypes?.value}
                    renderOption={(option, index) => {
                        //
                        return (
                            <Flex key={index} gap=".4rem">
                                <IconPickerItem
                                    value={option.label}
                                    color="#2EAFA3"
                                />
                                {option.key}
                            </Flex>
                        );
                    }}
                    renderSelection={(selected, settings, deselect) => {
                        //
                        return (
                            <Box className="react-selectrix rs-toggle">
                                <Flex gap=".4rem">
                                    <IconPickerItem
                                        value={selected?.label}
                                        color="#2EAFA3"
                                    />
                                    {selected?.key ||
                                        data?.leaveType.name ||
                                        'Select a type'}
                                </Flex>
                            </Box>
                        );
                    }}
                />

                <Grid
                    templateColumns={['repeat(1,1fr)', 'repeat(1,1fr)']}
                    gap="1rem 2rem"
                    mt="1.5rem"
                >
                    <HStack gap="22px">
                        <PrimaryDate<LeaveModel>
                            control={control}
                            name="startDate"
                            label={oneDay ? 'Leave Date' : 'Start Date'}
                            error={errors.startDate}
                            // min={new DateObject().add(0, 'days')}
                            disableWeekend
                            placeholder={data?.startDate}
                        />
                        <InputBlank
                            label="Duration"
                            variant="outline"
                            onChange={(e) => setDuration(e.target.value)}
                            value={duration}
                            suffix={
                                <InputRightElement right="3%">
                                    <Text fontSize="12px" color="#8c8c8c">
                                        Hours
                                    </Text>
                                </InputRightElement>
                            }
                        />
                    </HStack>
                    <Checkbox
                        size="sm"
                        mb="0rem"
                        onChange={(e) => setOneDay(e.target.checked)}
                    >
                        One day only
                    </Checkbox>
                    {!oneDay && (
                        <PrimaryDate<LeaveModel>
                            control={control}
                            name="endDate"
                            label="End Date"
                            error={errors.endDate}
                            min={new DateObject(
                                watch('startDate') as string,
                            ).add(0, 'days')}
                            disableWeekend
                            placeholder={data?.endDate}
                        />
                    )}
                </Grid>

                <VStack
                    py="14px"
                    borderY="1px solid #d9d9d9"
                    align="flex-start"
                    gap="19px"
                    my="1.5rem"
                >
                    <LeaveTextBox
                        title="Leave Duration"
                        value={leaveDuration}
                        suffix="Hours"
                    />
                    {showBalance ? (
                        <LeaveTextBox
                            title="Projected Leave Balance"
                            value={Number(leaveDaysLeft - leaveDuration)}
                            suffix="Hours"
                        />
                    ) : (
                        <Box>
                            <LeaveTextBox title="Projected Leave Balance" />
                            <Text
                                fontSize="13px"
                                color="#429FCD"
                                cursor="pointer"
                                lineHeight="15px"
                                mt=".2rem"
                                onClick={() => setShowBalance(true)}
                            >
                                Calculate
                            </Text>
                        </Box>
                    )}
                </VStack>

                <VStack gap="1rem">
                    <PrimaryTextarea<LeaveModel>
                        label="Reason for leave"
                        name="reasonForLeave"
                        error={errors.reasonForLeave}
                        placeholder=""
                        defaultValue={''}
                        register={register}
                        color="#323232"
                    />
                    <SelectrixBox<LeaveModel>
                        control={control}
                        name="workAssigneeId"
                        error={errors.workAssigneeId}
                        keys="id"
                        keyLabel="fullName"
                        label="Work Assignee"
                        options={teamMembers?.data?.value.filter(
                            (x) => x.employeeInformationId !== id,
                        )}
                        searchable
                        placeholder={data?.workAssignee?.fullName}
                    />
                    {/* {role != 'TeamMember' && (
            <SelectrixBox<LeaveModel>
                control={control}
                name="invoiceGenerationFrequency"
                error={errors.invoiceGenerationFrequency}
                keys="id"
                keyLabel="fullName"
                label="Supervisor"
                options={supervisor?.value}
                searchable
            />
        )} */}
                </VStack>

                <DrawerFooter mt="2rem" p="0">
                    <Flex justify="space-between" w="full">
                        <Button
                            bgColor="#FF5B79"
                            color="white"
                            height="3rem"
                            fontSize="14px"
                            px="2rem"
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
                            px="2rem"
                            type="submit"
                            isLoading={isSubmitting}
                            spinner={<BeatLoader color="white" size={10} />}
                            boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                        >
                            <Box>Apply</Box>
                        </Button>
                    </Flex>
                </DrawerFooter>
            </form>
        </DrawerWrapper>
    );
};

export default Leaveform;
