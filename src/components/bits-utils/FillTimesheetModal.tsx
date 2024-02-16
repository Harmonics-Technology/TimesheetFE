import {
    Box,
    Checkbox,
    Circle,
    Flex,
    HStack,
    Icon,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Text,
    VStack,
    useRadioGroup,
    useToast,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { GrClose } from 'react-icons/gr';
import { ShiftBtn } from './ShiftBtn';
import { SelectrixBox } from './Selectrix';
import {
    ProjectManagementService,
    ProjectManagementSettingView,
    ProjectTimesheetModel,
    ProjectTimesheetRange,
    ProjectView,
} from 'src/services';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import Loading from './Loading';
import useComponentVisible from '@components/generics/useComponentVisible';
import { CustomDateTime } from './CustomDateTime';
import { ProgressSlider } from './ProgressSlider';
import { DateObject } from 'react-multi-date-picker';
import { useNonInitialEffect } from '@components/generics/useNonInitialEffect';
import InputBlank from './InputBlank';
import moment from 'moment';
import RadioBtn from './RadioBtn';
import { UserContext } from '@components/context/UserContext';
import { eachDayOfInterval, parseISO, startOfWeek } from 'date-fns';

interface ExportProps {
    isOpen: any;
    onClose: any;
    data?: any;
    superAdminId?: any;
    userId?: any;
    projectId?: any;
    allProjects?: ProjectView;
    access: ProjectManagementSettingView;
}

const schema = yup.object().shape({});

export const FillTimesheetModal = ({
    isOpen,
    onClose,
    data,
    superAdminId,
    userId,
    allProjects,
    access,
}: ExportProps) => {
    const {
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ProjectTimesheetModel>({
        resolver: yupResolver(schema),
        mode: 'all',
    });
    const router = useRouter();
    const toast = useToast();

    function isValidDateTime(dateTime) {
        return dateTime && !isNaN(new Date(dateTime).getTime());
    }
    const initialStartDate = isValidDateTime(data?.startDate)
        ? moment(data.startDate)
        : moment().format('YYYY-MM-DD 09:00');
    const [startDate, setstartDate] = useState<any>(initialStartDate);
    const [endDate, setendDate] = useState<any>(moment(data.endDate));
    const [isBillable, setisBillable] = useState<any>();
    const [loading, setLoading] = useState<any>();

    const { user } = useContext(UserContext);
    const hoursPerDay = user?.employeeInformation?.hoursPerDay || 8;

    const [sliderValue, setSliderValue] = useState(0);

    const repeating = [
        { id: 0, name: 'SU' },
        { id: 1, name: 'MO' },
        { id: 2, name: 'TU' },
        { id: 3, name: 'WE' },
        { id: 4, name: 'TH' },
        { id: 5, name: 'FR' },
        { id: 6, name: 'SA' },
    ];
    const [selectedId, setSelectedId] = useState<any>([]);

    const formattedStartDate = moment(startDate).day();
    console.log({ startDate, selectedId, formattedStartDate, endDate });
    const toggleSelected = (value: any) => {
        const existingValue = selectedId?.find((e) => e?.id === value?.id);
        if (existingValue) {
            const newArray = selectedId?.filter((x) => x?.id !== value?.id);
            setSelectedId(newArray);
            return;
        }
        setSelectedId([...selectedId, value]);
    };

    const [projectTimesheets, setProjectTimesheets] =
        useState<ProjectTimesheetRange>({});

    // console.log({ projectTimesheets });
    const [newProjectTimesheet, setNewProjectTimesheet] = useState([]);
    const [duration, setDuration] = useState(0);

    const firstDateOfWeek = startOfWeek(parseISO(startDate));
    const selectedStartTime = moment(startDate).format('HH:mm');
    const selectedEndTime = moment(endDate).format('HH:mm');
    useEffect(() => {
        const updatedProjectTimesheets = selectedId.map((x, i) => ({
            ...projectTimesheets,
            startDate: moment(firstDateOfWeek)
                .add(x?.id, 'day')
                .format(`YYYY-MM-DD ${selectedStartTime}`),
            endDate: useEnd
                ? moment(
                      moment(firstDateOfWeek)
                          .add(x?.id, 'day')
                          .format(`YYYY-MM-DD ${selectedStartTime}`),
                  )
                      .add(hoursPerDay, 'hour')
                      .format('YYYY-MM-DD HH:mm')
                : moment(
                      moment(firstDateOfWeek)
                          .add(x?.id, 'day')
                          .format(`YYYY-MM-DD ${selectedStartTime}`),
                  )
                      .add(duration, 'hour')
                      .format('YYYY-MM-DD HH:mm'),
        }));

        setNewProjectTimesheet(updatedProjectTimesheets);
    }, [selectedId, projectTimesheets]);

    console.log({ newProjectTimesheet });

    useEffect(() => {
        setProjectTimesheets({
            ...projectTimesheets,
            startDate,
        });
        setSelectedId([repeating.find((x) => x.id == formattedStartDate)]);
    }, [startDate]);

    useEffect(() => {
        setProjectTimesheets({
            ...projectTimesheets,
            endDate,
        });

        const dateDiff = moment(endDate).diff(startDate, 'days') + 1;

        // Get the first selected item based on formattedStartDate
        const firstSelectedItem = repeating.find(
            (x) => x.id === formattedStartDate,
        );

        // Create an array starting with the firstSelectedItem and mapping the rest
        const updatedSelectedId = [
            firstSelectedItem,
            ...Array.from({ length: dateDiff - 1 }, (_, index) => ({
                id: ((firstSelectedItem?.id as any) + index + 1) % 7, // Ensure the id stays within the range [0, 6] by using modulo
                name: repeating[
                    ((firstSelectedItem?.id as any) + index + 1) % 7
                ].name, // Get the corresponding name
            })),
        ];

        setSelectedId(updatedSelectedId);
    }, [endDate, startDate, formattedStartDate]);
    useEffect(() => {
        setProjectTimesheets({
            ...projectTimesheets,
            percentageOfCompletion: sliderValue,
        });
    }, [sliderValue]);
    useEffect(() => {
        setProjectTimesheets({
            ...projectTimesheets,
            billable: isBillable,
        });
    }, [isBillable]);

    const taskId = watch('projectTaskId');
    const projectId = watch('projectId');
    const [useEnd, setUseEnd] = useState<boolean>(true);
    const [tasks, setTasks] = useState<any>([]);
    const newData = [
        ...((allProjects as ProjectView[]) || []),
        { id: 'operational', name: 'Operational Task' },
    ];
    const [subTasks, setSubTasks] = useState<any>([]);
    const [err, setErr] = useState<any>([]);
    const [operationalTasks, setOperationalTasks] = useState<any>([]);

    const hasAccess =
        access?.projectMembersTimesheetVisibility ||
        access?.taskMembersTimesheetVisibility;
    useNonInitialEffect(() => {
        async function getTasks() {
            setErr('');

            setSubTasks([]);

            setLoading(true);

            try {
                const res = await ProjectManagementService.listSubTasks(
                    0,
                    25,
                    taskId as string,
                );
                if (res?.status) {
                    setSubTasks(res?.data?.value);
                    setLoading(false);
                    return;
                }
                setErr(res?.message);
                setLoading(false);
            } catch (error: any) {
                setErr(error?.body?.message || error?.message);
                setLoading(false);
            }
        }
        getTasks();
    }, [taskId]);

    useNonInitialEffect(() => {
        async function getTasks() {
            if (projectId) {
                setLoading(true);
            }
            setOperationalTasks([]);
            setErr('');
            setSubTasks([]);
            if (taskId == 'operational') {
                try {
                    const res =
                        await ProjectManagementService.listOperationalTasks(
                            0,
                            25,
                            superAdminId,
                            2,
                            userId,
                        );
                    if (res?.status) {
                        setOperationalTasks(res?.data?.value);
                        setLoading(false);
                        return;
                    }
                    setErr(res?.message);
                    setLoading(false);
                } catch (error: any) {
                    setErr(error?.body?.message || error?.message);
                    setLoading(false);
                }
                return;
            }
            try {
                const res = await ProjectManagementService.listTasks(
                    0,
                    25,
                    superAdminId,
                    (projectId as string) || undefined,
                    undefined,
                    hasAccess ? undefined : userId,
                );
                if (res?.status) {
                    setLoading(false);
                    setTasks(res?.data?.value);
                    return;
                }
            } catch (error) {
                setLoading(false);
            }
        }
        getTasks();
    }, [projectId]);

    const radios = ['Use Duration', 'Use End Date'];
    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'selection',
        defaultValue: 'Use End Date',
        onChange: (value) => updateClientField(value),
    });

    const updateClientField = (value: any) => {
        if (value == 'Use Duration') {
            setUseEnd(false);
        } else {
            setUseEnd(true);
        }
    };

    const group = getRootProps();

    const changeDuration = (e: any) => {
        setDuration(e);
        const endDate = moment(startDate)
            .add(e, 'hours')
            .format('YYYY-MM-DD HH:mm');
        setProjectTimesheets({
            ...projectTimesheets,
            endDate,
        });
    };

    const selectedTask = tasks?.find(
        (task) => task?.id === watch('projectTaskId'),
    );
    const selectedSubTask = subTasks?.find(
        (subTask) => subTask?.id === watch('projectSubTaskId'),
    );

    console.log({ duration });

    const onSubmit = async (data: ProjectTimesheetModel) => {
        const endOfDate = (newProjectTimesheet as any)[0]?.endDate;
        if (!endOfDate || endOfDate == 'Invalid date') {
            toast({
                title: 'Please select a duration or end date',
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            return;
        }
        data.projectTaskAsigneeId =
            selectedSubTask?.projectTaskAsigneeId ||
            selectedTask.assignees.find((x) => x.userId == userId)?.id;
        data.projectTimesheets = newProjectTimesheet;
        try {
            const result =
                await ProjectManagementService.fillTimesheetForProject(data);
            if (result.status) {
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.replace(router.asPath);
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

    useNonInitialEffect(() => {
        setSliderValue(
            selectedSubTask?.percentageOfCompletion ||
                selectedTask?.percentageOfCompletion,
        );
    }, [taskId, watch('projectSubTaskId')]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            motionPreset="slideInBottom"
            isCentered
            trapFocus={false}
        >
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />

            <ModalContent
                py={5}
                borderRadius="0px"
                w={['88%', '35%']}
                // overflow="hidden"
                maxH="100vh"
                pos="fixed"
                mt="1rem"
                mb="1rem"
                maxW="100%"
            >
                <ModalHeader textAlign="center">
                    <Box mb="1rem">
                        {loading ? (
                            <Spinner size={'sm'} />
                        ) : err ? (
                            <Text fontSize=".8rem" color="red.300">
                                {err}
                            </Text>
                        ) : null}
                    </Box>
                    <Flex justify="space-between">
                        <Text
                            color="black"
                            fontSize="1.1rem"
                            textAlign="center"
                            fontWeight="semibold"
                        >
                            Fill My Timesheet
                        </Text>
                        <Icon as={GrClose} onClick={onClose} cursor="pointer" />
                    </Flex>
                </ModalHeader>

                <ModalBody>
                    <Box maxH="77vh" overflowY="auto" px={[2, 5]}>
                        {/* <Loading loading={loading} /> */}
                        <form>
                            <VStack
                                align="flex-start"
                                w="full"
                                spacing="0"
                                gap="1rem"
                                mb="1rem"
                                borderBottom="1px solid #e6e7e7"
                            >
                                <SelectrixBox<ProjectTimesheetModel>
                                    control={control}
                                    name="projectId"
                                    label="Project"
                                    error={errors.projectId}
                                    keys="id"
                                    keyLabel="name"
                                    options={newData}
                                    placeholder={'Select a project'}
                                />
                                <SelectrixBox<ProjectTimesheetModel>
                                    control={control}
                                    name="projectTaskId"
                                    label="Project Task"
                                    error={errors.projectTaskId}
                                    keys="id"
                                    keyLabel="name"
                                    options={tasks}
                                    placeholder={'Select a task'}
                                />
                                {subTasks.length > 0 && (
                                    <SelectrixBox<ProjectTimesheetModel>
                                        control={control}
                                        name="projectSubTaskId"
                                        label="Sub Task"
                                        error={errors.projectSubTaskId}
                                        keys="id"
                                        keyLabel="name"
                                        options={subTasks}
                                        placeholder={'Select a subTask'}
                                    />
                                )}
                                {operationalTasks.length > 0 && (
                                    <SelectrixBox<ProjectTimesheetModel>
                                        control={control}
                                        name="projectTaskId"
                                        label="Operational Task"
                                        error={errors.projectTaskId}
                                        keys="id"
                                        keyLabel="name"
                                        options={operationalTasks}
                                        placeholder={'Select operational task'}
                                    />
                                )}
                                <CustomDateTime
                                    onChange={setstartDate}
                                    value={startDate}
                                    label="Start Date & Time"
                                    useEnd={false}
                                />
                                <HStack w="full" {...group} fontSize=".8rem">
                                    {radios.map((value) => {
                                        const radio = getRadioProps({
                                            value,
                                        });
                                        return (
                                            <RadioBtn {...radio} key={value}>
                                                {value}
                                            </RadioBtn>
                                        );
                                    })}
                                </HStack>

                                {useEnd ? (
                                    <CustomDateTime
                                        onChange={setendDate}
                                        value={endDate}
                                        label="End Date"
                                        useEnd={useEnd}
                                    />
                                ) : (
                                    <Box w="full" mb=".5rem">
                                        <InputBlank
                                            placeholder="Duration in hours"
                                            label="Duration"
                                            onChange={(e) =>
                                                changeDuration(e.target.value)
                                            }
                                        />
                                        <HStack
                                            gap="2rem"
                                            w="full"
                                            justify="space-between"
                                            align="center"
                                            mt="1rem"
                                        >
                                            <Text
                                                fontSize=".8rem"
                                                w="full"
                                                mb="0"
                                                fontWeight={500}
                                            >
                                                Recur Timeslot:
                                            </Text>
                                            <HStack w="full">
                                                <HStack gap=".2rem">
                                                    {repeating.map((x) => (
                                                        <Circle
                                                            bgColor={
                                                                selectedId?.find(
                                                                    (e) =>
                                                                        e?.id ==
                                                                        x?.id,
                                                                ) ||
                                                                formattedStartDate ==
                                                                    x?.id
                                                                    ? 'brand.400'
                                                                    : 'gray.200'
                                                            }
                                                            color={
                                                                selectedId?.find(
                                                                    (e) =>
                                                                        e?.id ==
                                                                        x?.id,
                                                                ) ||
                                                                formattedStartDate ==
                                                                    x?.id
                                                                    ? 'white'
                                                                    : 'gray.600'
                                                            }
                                                            border={
                                                                selectedId?.find(
                                                                    (e) =>
                                                                        e?.id ==
                                                                        x?.id,
                                                                ) ||
                                                                formattedStartDate ==
                                                                    x?.id
                                                                    ? '2px solid #ffac00'
                                                                    : 'none'
                                                            }
                                                            fontSize=".7rem"
                                                            size="1.5rem"
                                                            _hover={{
                                                                border: '2px solid #ffac00',
                                                            }}
                                                            onClick={() =>
                                                                toggleSelected(
                                                                    x,
                                                                )
                                                            }
                                                        >
                                                            {x.name.charAt(0)}
                                                        </Circle>
                                                    ))}
                                                </HStack>
                                            </HStack>
                                        </HStack>
                                    </Box>
                                )}
                                <ProgressSlider
                                    sliderValue={sliderValue}
                                    setSliderValue={setSliderValue}
                                    label="Percentage Of Completion"
                                />
                                <Checkbox
                                    fontSize=".8rem"
                                    color="#8c8c8c"
                                    colorScheme="brand"
                                    mb="2rem"
                                    onChange={() =>
                                        setisBillable((prev) => !prev)
                                    }
                                >
                                    Check this box if this task is a billable
                                    task
                                </Checkbox>
                            </VStack>
                            <HStack gap="1rem" justify="space-between">
                                <ShiftBtn
                                    text="Cancel"
                                    bg="#FF5B79"
                                    onClick={onClose}
                                />
                                <ShiftBtn
                                    text="Submit"
                                    bg="brand.400"
                                    onClick={handleSubmit(onSubmit)}
                                    loading={isSubmitting}
                                />
                            </HStack>
                        </form>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
