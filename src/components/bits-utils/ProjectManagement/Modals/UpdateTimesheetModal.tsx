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
    Text,
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
import { DateObject } from 'react-multi-date-picker';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaInfoCircle, FaTimesCircle } from 'react-icons/fa';
import BeatLoader from 'react-spinners/BeatLoader';
import {
    ProjectManagementService,
    ProjectManagementTimesheetModel,
} from 'src/services';
import { ProjectTaskModel } from 'src/services';
import * as yup from 'yup';
import moment from 'moment';
import InputBlank from '@components/bits-utils/InputBlank';
import { PrimarySelect } from '@components/bits-utils/PrimarySelect';
import { ProjectSubTaskModel, UpdateProjectTimesheet } from 'src/services';

const schema = yup.object().shape({
    startDate: yup.string(),
    endDate: yup.string(),
    hours: yup.number(),
});

const UpdateTimesheetModal = ({
    isOpen,
    onClose,
    onSubmit,
    loading,
    isProgress,
    data,
    task,
    subTask,
    taskPriorityList,
    projectTaskAssigneeId,
    selectedTimesheet,
    sliderValue,
    setSliderValue,
    projectId,
    addToTimesheet,
    totalHoursSpent,
    ListUserTimesheet,
}: {
    isOpen: any;
    onClose: any;
    onSubmit?: any;
    loading?: any;
    isProgress?: any;
    data?: any;
    task?: any;
    subTask?: any;
    taskPriorityList?: any;
    projectTaskAssigneeId: any;
    selectedTimesheet: any;
    sliderValue: any;
    setSliderValue: any;
    projectId: any;
    addToTimesheet: any;
    totalHoursSpent: any;
    ListUserTimesheet?: any;
}) => {
    // console.log('this is the task', selectedTimesheet);
    const pastDate = moment().diff(moment(data?.endDate), 'days') > 0;
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const toast = useToast();
    const [hours, setHours] = useState<number>(0);

    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting, isDirty },
    } = useForm<ProjectManagementTimesheetModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            startDate: selectedTimesheet?.startDate,
            endDate: selectedTimesheet?.endDate,
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

    const UpdateTimesheet = async (data: ProjectManagementTimesheetModel) => {
        data.id = selectedTimesheet.id;
        data.projectTaskId = task.id;
        data.projectId = projectId;
        data.percentageOfCompletion = sliderValue;
        data.projectTaskAsigneeId = selectedTimesheet?.projectTaskAsigneeId;
        data.addToTimesheet = addToTimesheet;
        try {
            if (
                (subTask?.length > 0 && data?.projectSubTaskId === '') ||
                data?.projectSubTaskId === null
            ) {
                toast({
                    title: 'Please select a SubTask to continue',
                    status: 'error',
                    isClosable: true,
                    position: 'top-right',
                });
            } else {
                const res =
                    await ProjectManagementService.updateProjectManagementTimesheetForProject(
                        data,
                    );
                if (res?.status === true) {
                    //  setLoading({ id: '' });
                    // router.replace(router.asPath);
                    toast({
                        title: res.message,
                        status: 'success',
                        isClosable: true,
                        position: 'top-right',
                    });
                    onClose();
                    ListUserTimesheet();
                    // router.reload();
                    reset();
                    return;
                }
                //  setLoading({ id: '' });
                toast({
                    title: res.message,
                    status: 'error',
                    isClosable: true,
                    position: 'top-right',
                });
            }
        } catch (err: any) {
            //  setLoading({ id: '' });
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
                // overflow="hidden"
                maxH="100vh"
                pos="fixed"
            >
                <ModalHeader textAlign="center">
                    <>
                        {!selectedTimesheet?.addToTimesheet && (
                            <Flex
                                alignItems="center"
                                color="gray.500"
                                fontSize="3rem"
                                justifyContent="space-between"
                                borderBottom="1px solid #EBEFF2"
                                pb="10px"
                            >
                                <Heading fontSize={16} fontWeight={600}>
                                    Edit Hours
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
                        )}
                    </>
                </ModalHeader>

                <ModalBody>
                    {selectedTimesheet?.addToTimesheet ? (
                        <Box w="100%">
                            <Text mb="7" textAlign="center">
                                Time was added to timesheet. Kindly make update
                                from the task calendar view
                            </Text>
                            <Box
                                textAlign="center"
                                display="flex"
                                justifyContent="center"
                                alignItems="center"
                            >
                                <Button
                                    textAlign="center"
                                    variant="solid"
                                    height="2.6rem"
                                    width="75px"
                                    bgColor="brand.400"
                                    color="white"
                                    borderRadius="5px"
                                    fontWeight={500}
                                    onClick={onClose}
                                >
                                    Close
                                </Button>
                            </Box>
                        </Box>
                    ) : (
                        <Box>
                            <Stack spacing="24px">
                                <InputBlank
                                    label="Task Name"
                                    placeholder=""
                                    defaultValue={task?.name as string}
                                    readonly={true}
                                />
                                {subTask?.length > 0 && (
                                    <PrimarySelect<ProjectManagementTimesheetModel>
                                        register={register}
                                        error={errors.projectSubTaskId}
                                        name="projectSubTaskId"
                                        label="Sub Task Name"
                                        placeholder="Select a sub Task"
                                        options={
                                            <>
                                                {subTask?.map((x) => (
                                                    <option value={x?.id}>
                                                        {x.name}
                                                    </option>
                                                ))}
                                            </>
                                        }
                                    />
                                )}
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
                                        defaultValue={
                                            new Date(
                                                selectedTimesheet?.startDate,
                                            )
                                        }
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
                                        defaultValue={
                                            new Date(selectedTimesheet?.endDate)
                                        }
                                        // placeholder={
                                        //     new Date(subTask?.endDate)
                                        //         .toISOString()
                                        //         .split('T')[0]
                                        // }
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
                                                label="Hours"
                                                name="hours"
                                                error={errors.hours}
                                                placeholder=""
                                                defaultValue={
                                                    selectedTimesheet?.totalHours
                                                }
                                                register={register}
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
                                        value={`${totalHoursSpent} Hours`}
                                    />
                                </Grid>
                                {/* <PrimarySelect<ProjectManagementTimesheetModel>
                                register={register}
                                error={errors.taskPriority}
                                name="taskPriority"
                                label="Sub Task Priority"
                                placeholder="Select Sub Taskask priority"
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
                                <ProgressSlider
                                    sliderValue={Math.round(sliderValue)}
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
                                        spinner={
                                            <BeatLoader
                                                color="white"
                                                size={10}
                                            />
                                        }
                                        onClick={() =>
                                            handleSubmit(UpdateTimesheet)()
                                        }
                                    >
                                        Update
                                    </Button>
                                </HStack>
                            </Stack>
                        </Box>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default UpdateTimesheetModal;
