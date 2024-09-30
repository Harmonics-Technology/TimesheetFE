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
    Grid, Progress, 
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
import { ProjectManagementService } from 'src/services';
import { ProjectTaskModel } from 'src/services';
import * as yup from 'yup';
import moment from 'moment';
import { ProjectManagementTimesheetModel } from 'src/services';


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

const AddHoursToTimesheetModal = ({
    isOpen,
    onClose,
    onSubmit,
    // loading,
    text,
    isProgress,
    data,
    sliderValue,
    watch,
    task,
    subTask,
    onSunmit,
    loading,
    setAddItemToTimesheet,
}: {
    isOpen: any;
    onClose: any;
    onSubmit?: any;
    loading?: any;
    text: any;
    isProgress?: any;
    data?: any;
    sliderValue?: any;
    watch?: any;
    task?: any;
    subTask?: any;
    onSunmit?: any;
    setAddItemToTimesheet?: any;
}) => {
    // const [isLoading, setIsLoading] = useState(false);
    // const router = useRouter();
    // const toast = useToast();
    // const [hours, setHours] = useState<number>(0);

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
    const subTaskValue = subTask?.find(
        (x: any) => x?.id === watch('projectSubTaskId'),
    );

    const handleClick = async (type: string) => {
        await setAddItemToTimesheet(type === 'Yes' ? true : false);
        await onSubmit();
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
                py="5"
                borderRadius="0px"
                w="88%"
                overflow="hidden"
                maxH="100vh"
                pos="fixed"
            >
                <ModalHeader textAlign="center">
                    <Heading fontSize={16} fontWeight={600}>
                        Do you want to add this hours to your timesheet
                    </Heading>
                </ModalHeader>

                <ModalBody>
                    <Box>
                        <Stack spacing="24px">
                            <Box>
                                <Heading
                                    mb="4px"
                                    fontSize={15}
                                    fontWeight={500}
                                >
                                    Task Name
                                </Heading>
                                <Text fontSize={14.5}>{task?.name}</Text>
                            </Box>
                            <Box>
                                <Heading
                                    mb="4px"
                                    fontSize={15}
                                    fontWeight={500}
                                >
                                    Sub Task Name
                                </Heading>
                                <Text fontSize={14.5}>
                                    {subTaskValue?.name}
                                    {/* {subTask?.map((x: any) => watch(x.name))} */}
                                    {/* {watch('subtask.name')} */}
                                </Text>
                            </Box>
                            <Grid
                                templateColumns={[
                                    'repeat(1,1fr)',
                                    'repeat(2,1fr)',
                                ]}
                                gap="1rem 1rem"
                                w="full"
                            >
                                <Box>
                                    <Heading
                                        mb="4px"
                                        fontSize={15}
                                        fontWeight={500}
                                    >
                                        Start Date
                                    </Heading>
                                    <Text fontSize={14.5}>
                                        {watch('startDate')}
                                    </Text>
                                </Box>
                                <Box>
                                    <Heading
                                        mb="4px"
                                        fontSize={15}
                                        fontWeight={500}
                                    >
                                        End Date
                                    </Heading>
                                    <Text fontSize={14.5}>
                                        {watch('endDate')}
                                    </Text>
                                </Box>
                            </Grid>
                            <Box>
                                <Heading
                                    mb="4px"
                                    fontSize={15}
                                    fontWeight={500}
                                >
                                    Hours
                                </Heading>
                                <Text fontSize={14.5}>{watch('hours')}</Text>
                            </Box>
                            <Box>
                                <Heading
                                    mb="4px"
                                    fontSize={15}
                                    fontWeight={500}
                                >
                                    Percentage Complete
                                </Heading>
                                <Box>
                                    <Text
                                        textAlign="right"
                                        color="#787486"
                                        fontSize={12}
                                    >
                                        {sliderValue}%
                                    </Text>
                                    <Progress
                                        value={sliderValue}
                                        h="5px"
                                        borderRadius="5px"
                                        colorScheme="green"
                                    />
                                </Box>
                            </Box>
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
                                    onClick={() => handleClick('No')}
                                >
                                    No
                                </Button>
                                <Button
                                    variant="solid"
                                    height="2.6rem"
                                    width="auto"
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
                                    onClick={() => handleClick('Yes')}
                                >
                                    Add to timesheet
                                </Button>
                            </HStack>
                        </Stack>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AddHoursToTimesheetModal;
