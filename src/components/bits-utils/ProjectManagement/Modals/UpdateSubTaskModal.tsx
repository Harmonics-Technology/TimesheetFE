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
import { ProjectSubTaskModel } from 'src/services';

const schema = yup.object().shape({
    startDate: yup.string().required(),
    endDate: yup.string().required(),
    taskPriority: yup.number().required(),
    duration: yup.number(),
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
    loading,
    isProgress,
    data,
    task,
    subTask,
    taskPriorityList,
    projectTaskAssigneeId,
    totalHoursSpent
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
    } = useForm<ProjectSubTaskModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {},
    });

    const updateHours = (type: 'minus' | 'plus') => {
        if (type === 'plus') {
            setValue('duration', Number(watch('duration')) + 1);
            return;
        }
        if (type === 'minus') {
            if (Number(watch('duration')) <= 0) {
                setValue('duration', 0);
                return;
            }
            setValue('duration', Number(watch('duration')) - 1);
            return;
        }
    };

    const UpdateSubTask = async (data: ProjectSubTaskModel) => {
        data.name = subTask?.name as string;
        data.id = subTask?.id as string;
        data.projectTaskId = task?.id;
        data.projectTaskAsigneeId = projectTaskAssigneeId;
        // data.taskPriority = ;
        try {
            const res = await ProjectManagementService.updateSubTask(data);
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
                router.reload();
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
                overflow="hidden"
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
                                Update Sub Task
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
                            <PrimarySelect<ProjectSubTaskModel>
                                register={register}
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
                            />
                            <Grid
                                templateColumns={[
                                    'repeat(1,1fr)',
                                    'repeat(2,1fr)',
                                ]}
                                gap="1rem 1rem"
                                w="full"
                            >
                                <PrimaryDate<ProjectSubTaskModel>
                                    control={control}
                                    name="startDate"
                                    label="Start Date"
                                    error={errors.startDate}
                                    // min={new DateObject()}
                                    defaultValue={new Date(subTask?.startDate)}
                                    // placeholder={
                                    //     new Date(subTask?.startDate)
                                    //         .toISOString()
                                    //         .split('T')[0]
                                    // }
                                />
                                <PrimaryDate<ProjectSubTaskModel>
                                    control={control}
                                    name="endDate"
                                    label="End Date"
                                    error={errors.endDate}
                                    // min={new DateObject().add(1, 'days')}
                                    defaultValue={new Date(subTask?.endDate)}
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
                                        <PrimaryInput<ProjectSubTaskModel>
                                            label="Edit Duration"
                                            name="duration"
                                            error={errors.duration}
                                            placeholder=""
                                            defaultValue={subTask?.duration}
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
                            {/* <ProgressSlider
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
                            /> */}
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
                                    // isLoading={loading}
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
