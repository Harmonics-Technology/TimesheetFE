import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    Flex,
    ModalBody,
    HStack,
    Button,
    Box,
    useToast,
    Heading,
    Stack,
    Grid,
} from '@chakra-ui/react';
import { PrimaryDate } from '@components/bits-utils/PrimaryDate';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import { ProgressSlider } from '@components/bits-utils/ProgressSlider';
import { Round } from '@components/generics/functions/Round';
import {
    CloseIcon,
    GreenPlusIcon,
    RedMinusIcon,
} from '@components/icons/Icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    ProjectManagementService,
    ProjectManagementTimesheetModel,
} from 'src/services';
import * as yup from 'yup';
import moment from 'moment';
import InputBlank from '@components/bits-utils/InputBlank';

const schema = yup.object().shape({
    startDate: yup.string().required('Start Date is required'),
    endDate: yup.string().required('End Date is required'),
    hours: yup.number().required('Hours is required'),

    // duration: yup.number().required(),
    // isAssignedToMe: yup.number().required(),
    // assignedUsers: yup.array().min(1, 'Select atleast one assignee').required(),
    // category: yup.string().required(),
    // department: yup.string().required(),
    // taskPriority: yup.number().required(),
});

const UpdateSubTaskModal = ({
    isOpen,
    onClose,
    data,
    task,
    subTask,
    projectTaskAssigneeId,
    totalHoursSpent,
}: {
    isOpen: any;
    onClose: any;
    loading?: any;
    isProgress?: any;
    data?: any;
    task?: any;
    subTask?: any;
    taskPriorityList?: any;
    projectTaskAssigneeId: any;
    totalHoursSpent?: any;
}) => {
    const pastDate = moment().diff(moment(data?.endDate), 'days') > 0;
    const router = useRouter();
    const toast = useToast();
    const [sliderValue, setSliderValue] = useState(
        subTask?.percentageOfCompletion,
    );

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProjectManagementTimesheetModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            startDate: subTask?.startDate,
            endDate: subTask?.endDate,
            hours: subTask?.hoursSpent,
        },
    });

    const updateHours = (type: 'minus' | 'plus') => {
        if (type === 'plus') {
            setValue('hours', Number(watch('hours')) + 1);
            return;
        }
        if (type === 'minus') {
            if (Number(watch('hours')) <= 0) {
                setValue('hours', 0);
                return;
            }
            setValue('hours', Number(watch('hours')) - 1);
            return;
        }
    };

    const UpdateSubTask = async (data: ProjectManagementTimesheetModel) => {
        data.projectSubTaskId = subTask?.id as string;
        data.projectId = task?.projectId;
        data.projectTaskId = task?.id;
        data.projectTaskAsigneeId = projectTaskAssigneeId;
        // data.projectTaskAsigneeId = subTask?.projectTaskAsigneeId;
        data.percentageOfCompletion = sliderValue;
        try {
            const res =
                await ProjectManagementService.fillProjectManagementTimesheetForProject(
                    data,
                );
            if (res?.status === true) {
                //   setLoading({ id: '' });
                router.replace(router.asPath);
                toast({
                    title: res.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                //   setOpenAddToTimesheetModal(false);
                onClose();
                // router.reload();
                reset();
                return;
            }
            //   setLoading({ id: '' });
            toast({
                title: res.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (err: any) {
            //   setLoading({ id: '' });
            toast({
                title: err?.body?.message || err.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            motionPreset="slideInBottom"
            isCentered
        >
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />

            <ModalContent
                pb="5"
                borderRadius="0px"
                w="88%"
                overflow="auto"
                maxH="100vh"
                pos="fixed"
            >
                <ModalHeader textAlign="center">
                    <>
                        <Flex
                            alignItems="center"
                            color="gray.500"
                            fontSize="3rem"
                            justifyContent="space-between"
                            borderBottom="1px solid #EBEFF2"
                            pb="10px"
                        >
                            <Heading fontSize={16} fontWeight={600}>
                                Update Sub Task Progress
                            </Heading>
                            <Button
                                onClick={() => {
                                    onClose();
                                }}
                                p="0"
                                bg="0"
                            >
                                <CloseIcon />
                            </Button>
                        </Flex>
                    </>
                </ModalHeader>

                <ModalBody>
                    <Box>
                        <Stack spacing="24px">
                            <InputBlank
                                label="Task Name"
                                placeholder=""
                                defaultValue={task?.name as string}
                                readonly={true}
                            />
                            <InputBlank
                                label="Sub Task Name"
                                placeholder=""
                                defaultValue={subTask?.name as string}
                                readonly={true}
                            />
                            {/* <PrimarySelect<ProjectSubTaskModel>
                                register={register}
schema={schema}
                                error={errors.taskPriority}
                                name="taskPriority"
                                label="Sub Task Priority"
                                placeholder="Select Sub Task priority"
                                options={
                                    <>
                                        {taskPriorityList?.map((x, index) => (
                                            <option value={x.id}>
                                                {x.label}
                                            </option>
                                        ))}
                                    </>
                                }
                            /> */}
                            <Grid
                                templateColumns={[
                                    'repeat(1,1fr)',
                                    'repeat(2,1fr)',
                                ]}
                                gap="1rem 1rem"
                                w="full"
                            >
                                <PrimaryDate<ProjectManagementTimesheetModel>
                                    control={control}
                                    name="startDate"
                                    label="Start Date"
                                    error={errors.startDate}
                                    // min={new DateObject()}
                                    placeholder={moment(
                                        subTask?.startDate,
                                    ).format('YYYY/MM/DD')}
                                    // placeholder={
                                    //     new Date(subTask?.startDate)
                                    //         .toISOString()
                                    //         .split('T')[0]
                                    // }
                                />
                                <PrimaryDate<ProjectManagementTimesheetModel>
                                    control={control}
                                    name="endDate"
                                    label="End Date"
                                    error={errors.endDate}
                                    // min={new DateObject().add(1, 'days')}
                                    // defaultValue={new Date(subTask?.endDate)}
                                    placeholder={moment(
                                        subTask?.endDate,
                                    ).format('YYYY/MM/DD')}
                                />
                            </Grid>
                            <Grid
                                templateColumns={[
                                    'repeat(1,1fr)',
                                    'repeat(2,1fr)',
                                ]}
                                gap="1rem 1rem"
                                w="full"
                            >
                                <Box>
                                    <Flex alignItems="flex-end" gap="5px">
                                        <PrimaryInput<ProjectManagementTimesheetModel>
                                            label="Edit Hours"
                                            name="hours"
                                            error={errors.hours}
                                            placeholder=""
                                            register={register}
                                            schema={schema}
                                        />
                                        <Box>
                                            <Stack spacing="12px">
                                                <Button
                                                    p="0"
                                                    bg="none"
                                                    w="14px"
                                                    h="14px"
                                                    _hover={{
                                                        bg: 'none',
                                                        p: 0,
                                                    }}
                                                    onClick={() =>
                                                        updateHours('plus')
                                                    }
                                                >
                                                    <GreenPlusIcon />
                                                </Button>
                                                <Button
                                                    p="0"
                                                    bg="none"
                                                    w="14px"
                                                    h="14px"
                                                    _hover={{
                                                        bg: 'none',
                                                        p: 0,
                                                    }}
                                                    onClick={() =>
                                                        updateHours('minus')
                                                    }
                                                >
                                                    <RedMinusIcon />
                                                </Button>
                                            </Stack>
                                        </Box>
                                    </Flex>
                                </Box>
                                <InputBlank
                                    label="Total Hours Spent"
                                    placeholder=""
                                    defaultValue=""
                                    readonly={true}
                                    disableLabel={true}
                                    value={`${subTask?.hoursSpent} Hours`}
                                />
                            </Grid>
                            <ProgressSlider
                                sliderValue={sliderValue}
                                setSliderValue={setSliderValue}
                                leftText="Percentage Of Completetion"
                                showProgress
                                rightText={`${Round(sliderValue)}%`}
                                barColor={
                                    status == 'completed'
                                        ? 'brand.400'
                                        : status == 'ongoing' && pastDate
                                        ? 'red'
                                        : status == 'ongoing'
                                        ? '#f7e277'
                                        : status == 'not started'
                                        ? 'gray.100'
                                        : 'red'
                                }
                            />
                            <HStack
                                px=".8rem"
                                spacing={4}
                                w="full"
                                justifyContent="space-between"
                            >
                                <Button
                                    borderRadius="5px"
                                    height="2.6rem"
                                    width="70px"
                                    color="#ffffff"
                                    bg="#FF5B79"
                                    fontWeight={500}
                                    onClick={() => {
                                        onClose();
                                    }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="solid"
                                    height="2.6rem"
                                    width="75px"
                                    bgColor="brand.400"
                                    color="white"
                                    borderRadius="5px"
                                    fontWeight={500}
                                    _hover={{
                                        bgColor: 'white',
                                        color: 'brand.400',
                                        border: '1px solid',
                                        borderColor: 'brand.400',
                                    }}
                                    isLoading={isSubmitting}
                                    // spinner={
                                    //     <BeatLoader color="white" size={10} />
                                    // }
                                    onClick={() =>
                                        handleSubmit(UpdateSubTask)()
                                    }
                                >
                                    Update
                                </Button>
                            </HStack>
                        </Stack>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default UpdateSubTaskModal;
