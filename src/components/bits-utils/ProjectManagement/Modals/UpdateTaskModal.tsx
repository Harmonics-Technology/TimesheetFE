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

const schema = yup.object().shape({
    name: yup.string().required(),
    startDate: yup.string().required(),
    endDate: yup.string().required(),
    // duration: yup.number().required(),
    // isAssignedToMe: yup.number().required(),
    // assignedUsers: yup.array().min(1, 'Select atleast one assignee').required(),
    // category: yup.string().required(),
    // department: yup.string().required(),
    // taskPriority: yup.number().required(),
});

const UpdateTaskModal = ({
    isOpen,
    onClose,
    onSubmit,
    loading,
    isProgress,
    data,
    register,
    errors,
    task,
    subTask,
    control,
    sliderValue,
    setSliderValue,
    updateHours,
    addToTimesheet,
    setOpenAddToTimesheetModal,
    totalHoursSpent,
}: {
    isOpen: any;
    onClose: any;
    onSubmit?: any;
    loading?: any;
    isProgress?: any;
    data?: any;
    register?: any;
    errors?: any;
    task?: any;
    subTask?: any;
    control?: any;
    sliderValue?: any;
    setSliderValue?: any;
    updateHours: (value: 'minus' | 'plus') => void;
    addToTimesheet?: boolean;
    setOpenAddToTimesheetModal?: (value: boolean) => void;
    totalHoursSpent?: any;
}) => {
    console.log('this is the task', task);
    const pastDate = moment().diff(moment(data?.endDate), 'days') > 0;
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const toast = useToast();
    const [hours, setHours] = useState<number>(0);

    // const updateProgress = async () => {
    //     setIsLoading(true);
    //     try {
    //         const res = await ProjectManagementService.updateSubtaskProgress(
    //             data?.id,
    //             sliderValue,
    //         );
    //         if (res.status) {
    //             setIsLoading(false);
    //             router.replace(router.asPath);
    //             toast({
    //                 title: res.message,
    //                 status: 'success',
    //                 isClosable: true,
    //                 position: 'top-right',
    //             });
    //             return;
    //         }
    //         setIsLoading(false);
    //         toast({
    //             title: res.message,
    //             status: 'error',
    //             isClosable: true,
    //             position: 'top-right',
    //         });
    //     } catch (err: any) {
    //         setIsLoading(false);
    //         toast({
    //             title: err?.body?.message || err.message,
    //             status: 'error',
    //             isClosable: true,
    //             position: 'top-right',
    //         });
    //     }
    // };

    // const {
    //     register,
    //     handleSubmit,
    //     control,
    //     watch,
    //     setValue,
    //     reset,
    //     formState: { errors, isSubmitting },
    // } = useForm<ProjectTaskModel>({
    //     resolver: yupResolver(schema),
    //     mode: 'all',
    //     defaultValues: {
    //         //  superAdminId,
    //         isOperationalTask: true,
    //         name: data?.name,
    //         id: data?.id,
    //         startDate: data?.startDate,
    //         endDate: data?.endDate,
    //         note: data?.note,
    //         operationalTaskStatus: data?.operationalTaskStatus,
    //         //  isAssignedToMe: assignedPerson,
    //     },
    // });

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
                        <Flex
                            alignItems="center"
                            color="gray.500"
                            fontSize="3rem"
                            justifyContent="space-between"
                            borderBottom="1px solid #EBEFF2"
                            pb="10px"
                        >
                            <Heading fontSize={16} fontWeight={600}>
                                Update Task
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
                                    // defaultValue={new Date(data?.startDate)}
                                />
                                <PrimaryDate<ProjectManagementTimesheetModel>
                                    control={control}
                                    name="endDate"
                                    label="End Date"
                                    error={errors.endDate}
                                    // min={new DateObject().add(1, 'days')}
                                    // defaultValue={moment(data?.endDate)?.format(
                                    //     'YYYY-MM-DD',
                                    // )}
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
                                            label="Add Hours"
                                            name="hours"
                                            error={errors.name}
                                            placeholder=""
                                            defaultValue=""
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
                                    isLoading={loading}
                                    spinner={
                                        <BeatLoader color="white" size={10} />
                                    }
                                    onClick={() => {
                                        onSubmit();
                                    }}
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

export default UpdateTaskModal;
