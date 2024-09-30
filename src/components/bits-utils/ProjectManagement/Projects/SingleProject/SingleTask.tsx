'use client';

import {
    Flex,
    Box,
    VStack,
    Text,
    HStack,
    Avatar,
    Button,
    Icon,
    Select,
    useDisclosure,
    Image,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Spinner,
    useToast,
    Stack,
} from '@chakra-ui/react';
import { SubSearchComponent } from '@components/bits-utils/SubSearchComponent';
import {
    TableRow,
    TableData,
    NewTableState,
} from '@components/bits-utils/TableData';
import colorSwatch from '@components/generics/colorSwatch';
import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { BiSolidPencil } from 'react-icons/bi';
import { FaEllipsisH, FaEye } from 'react-icons/fa';
import { ProgressBar } from '../../Generics/ProgressBar';
import { TableCard } from '../../Generics/TableCard';
import { StatusBadge } from '../../Generics/StatusBadge';
import { TopBar } from './TopBar';
import { AddSubTaskDrawer } from '../../Modals/AddSubTaskDrawer';
import {
    ProjectManagementService,
    ProjectSubTaskView,
    ProjectTaskAsigneeView,
    ProjectTaskView,
} from 'src/services';
import { Round } from '@components/generics/functions/Round';
import { ShiftBtn } from '@components/bits-utils/ShiftBtn';
import markAsCompleted from '@components/generics/functions/markAsCompleted';
import { ManageBtn } from '@components/bits-utils/ManageBtn';
import { MdVerified } from 'react-icons/md';
import { BsPenFill } from 'react-icons/bs';
import { ShowPrompt } from '../../Modals/ShowPrompt';
import { useRouter } from 'next/router';
import { ProgressSlider } from '@components/bits-utils/ProgressSlider';
import { AuditTrailSection } from '@components/subpages/AuditTrailSection';
import { AuditTrailAttachments } from '@components/subpages/AuditTrailAttachments';
import InputBlank from '@components/bits-utils/InputBlank';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import { GreenPlusIcon, RedMinusIcon } from '@components/icons/Icons';
import { PrimaryDate } from '@components/bits-utils/PrimaryDate';
import { ProjectManagementTimesheetModel } from 'src/services';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { UserContext } from '@components/context/UserContext';
import UpdateTimesheetModal from '../../Modals/UpdateTimesheetModal';


const schema = yup.object().shape({});

export const SingleTask = ({
    id,
    project,
    tasks,
    task,
    users,
    currencies,
}: {
    id: any;
    project: any;
    tasks: any;
    task: ProjectTaskView;
    users: any;
    currencies: any;
}) => {
    const tableHead = [
        'Task Name',
        'Task assigned to',
        'Hours spent',
        'Start Date',
        'End Date',
        'Status',
        'Actions',
    ];
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [currentView, setCurrentView] = useState('Activity');
    const {
        isOpen: isOpened,
        onOpen: onOpened,
        onClose: onClosed,
    } = useDisclosure();
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState({ id: '' });
    const toast = useToast();
    const router = useRouter();

     const ProjectTimesheetAssigneeId = task?.assignees?.find(
         (x) => x.userId === user?.id,
     )?.user?.id;

    const [subTask, setSubTask] = useState<ProjectSubTaskView>({});
    const [status, setStatus] = useState(task?.status?.toLowerCase());
    const [hours, setHours] = useState<number>(0);
    const [projectAssigneeDetails, setProjectAssigneeDetails] = useState<any>(
        [],
    );
    const [openEditTimesheetModal, setOpenEditTimeSheetModal] =
        useState<boolean>(false);
    const [addToTimesheet, setAddToTimesheet] = useState<boolean>();
    const [userProjectManagementTimesheet, setUserProjectManagementTimesheet] =
         useState<any>([]);
    const [selectedTimesheet, setSelectedTimesheet] = useState<any>([]);
     const [editTimesheetSliderValue, setEditTimesheetSliderValue] =
         useState<number>(selectedTimesheet?.percentageOfCompletion ?? 0);
     const taskPriorityList = [
         { id: 1, label: 'High' },
         { id: 2, label: 'Medium' },
         { id: 3, label: 'Low' },
     ];

    const {
        isOpen: isOpens,
        onOpen: onOpens,
        onClose: onCloses,
    } = useDisclosure();

    const openModal = (item: any) => {
        setSubTask({ ...item, isEdit: true });
        onOpen();
    };
    const pastDate = moment().diff(moment(task?.endDate), 'days') > 0;

    const [taskStatus, setTaskStatus] = useState();
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
        defaultValues: {},
    });
    const [loadings, setLoadings] = useState({ id: '' });
    const taskStat = (x: any) => {
        setTaskStatus(x);
    };

    const [sliderValue, setSliderValue] = useState(
        task?.percentageOfCompletion,
    );

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

    const getProjectAssigneeDetails = async () => {
        try {
            const res = await ProjectManagementService.getAssigneeDetail(
                user?.id as string,
                task?.id,
            );
            if (res.status) {
                setProjectAssigneeDetails(res.data);
                setAddToTimesheet(res?.data?.addTaskToTimesheet);
                return;
            }
        } catch (error: any) {
            toast({
                title: error?.body?.message || error.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const OpenEditTimesheetModal = (item: any) => {
        setSelectedTimesheet(item);
        setOpenEditTimeSheetModal(true);
    };

     const ListUserTimesheet = async () => {
         try {
             const res =
                 await ProjectManagementService.listUserProjectManagementTimesheet(
                     task?.id,
                 );
             if (res.status === true) {
                 setUserProjectManagementTimesheet(res.data);
                 return;
             }
         } catch (error: any) {
             toast({
                 title: error?.body?.message || error.message,
                 status: 'error',
                 isClosable: true,
                 position: 'top-right',
             });
         }
     };

     useEffect(() => {
         getProjectAssigneeDetails();
         ListUserTimesheet();
     }, []);


    return (
        <Box>
            <TopBar
                currencies={currencies}
                id={id}
                data={project}
                users={users}
            />
            <Flex gap=".5rem">
                <VStack w="25%">
                    <Box
                        borderRadius=".2rem"
                        border="1px solid #efefef"
                        bgColor="white"
                        p="1rem"
                        w="full"
                    >
                        <Text color="#2d3748" fontSize=".8rem" fontWeight={600}>
                            {task?.name}
                        </Text>
                        <Text
                            color="#8c8c8c"
                            fontSize=".68rem"
                            fontWeight={400}
                            my="1rem"
                        >
                            {task?.note}
                        </Text>
                        <Stack spacing="15px">
                            <PrimaryDate<ProjectManagementTimesheetModel>
                                control={control}
                                name="startDate"
                                label="Start Date"
                                error={errors.startDate}
                                defaultValue={
                                    new Date(task?.startDate || Date.now())
                                }
                                // max={new DateObject().subtract(1, 'days')}
                                // disabled={tasks?.value?.length < 1}
                            />
                            <PrimaryDate<ProjectManagementTimesheetModel>
                                control={control}
                                name="endDate"
                                label="End Date"
                                error={errors.endDate}
                                defaultValue={
                                    new Date(task.endDate || Date.now())
                                }
                                // max={new DateObject().subtract(1, 'days')}
                                // disabled={tasks?.value?.length < 1}
                            />
                            <Box>
                                <Flex alignItems="flex-end" gap="7px" h="100%">
                                    <Box h="100%" w={'100%'}>
                                        <PrimaryInput<ProjectManagementTimesheetModel>
                                            name="hours"
                                            label="Add Hours"
                                            error={errors.hours}
                                            defaultValue={hours}
                                            value={hours}
                                            register={register}
                                        />
                                    </Box>
                                    <Box>
                                        <Stack spacing="12px">
                                            <Button
                                                p="0"
                                                bg="none"
                                                _hover={{ bg: 'none', p: 0 }}
                                                onClick={() =>
                                                    updateHours('plus')
                                                }
                                                w="14px"
                                                h="14px"
                                            >
                                                <GreenPlusIcon />
                                            </Button>
                                            <Button
                                                p="0"
                                                bg="none"
                                                _hover={{ bg: 'none', p: 0 }}
                                                onClick={() =>
                                                    updateHours('minus')
                                                }
                                                w="14px"
                                                h="14px"
                                            >
                                                <RedMinusIcon />
                                            </Button>
                                        </Stack>
                                    </Box>
                                </Flex>
                            </Box>

                            <Box w="full" mt="0.5rem" mb="0px">
                                {/* <ProgressBar
                                    barWidth={task?.percentageOfCompletion}
                                    showProgress={true}
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
                                    leftText="Percntage of Completion"
                                    rightText={`${Round(
                                        task?.percentageOfCompletion,
                                    )}%`}
                                /> */}
                                <ProgressSlider
                                    sliderValue={sliderValue}
                                    setSliderValue={setSliderValue}
                                    leftText="Percntage of Completion"
                                    showProgress
                                    rightText={`${Round(sliderValue)}%`}
                                    // readonly={tasks?.value?.length < 1}
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
                            </Box>
                            <Box mb="7px" textAlign="right">
                                <ManageBtn
                                    onClick={onOpened}
                                    isLoading={loading.id == task?.id}
                                    btn="Update"
                                    bg="brand.400"
                                    w="fit-content"
                                    disabled={status == 'completed'}
                                    h="35px"
                                />
                            </Box>

                            <InputBlank
                                label="Total Hours Spent"
                                // defaultValue={`${projectAssigneeDetails?.projectManagementTimesheetHours} Hours`}
                                disableLabel={true}
                                readonly={true}
                                value={`${task?.hoursSpent} Hours`}
                            />
                        </Stack>

                        {/* <Flex mt="1rem" justify="space-between">
                            <ManageBtn
                                onClick={updateProgress}
                                isLoading={loading.id == 'update'}
                                btn="Update"
                                bg="brand.600"
                                w="fit-content"
                                disabled={
                                    sliderValue === task?.percentageOfCompletion
                                }
                            />
                            <ManageBtn
                                onClick={onOpened}
                                isLoading={loading.id == task?.id}
                                btn="Mark Task as Complete"
                                bg="brand.400"
                                w="fit-content"
                                disabled={status == 'completed'}
                            />
                        </Flex> */}
                    </Box>
                    {/* <VStack
                        borderRadius=".2rem"
                        border="1px solid #efefef"
                        bgColor="white"
                        justify="flex-start"
                        w="full"
                        p="1rem"
                    >
                        <StatusBadge
                            bg="#afb6e5"
                            title="Created:"
                            text={moment(task?.startDate).format('DD MMM YYYY')}
                        />
                        <StatusBadge
                            bg="#FFA681"
                            title="Deadline:"
                            text={moment(task?.endDate).format('DD MMM YYYY')}
                        />
                        <StatusBadge
                            bg="#4BAEEA"
                            title="Status:"
                            text={task?.status}
                        />
                    </VStack> */}
                    <Box
                        borderRadius=".2rem"
                        border="1px solid #efefef"
                        bgColor="white"
                        w="full"
                        p="1rem"
                    >
                        <Text color="#2d3748" fontWeight={600} fontSize=".8rem">
                            Assigned Team
                        </Text>

                        {task?.assignees?.map(
                            (x: ProjectTaskAsigneeView, i) => (
                                <HStack mt=".5rem" gap="1rem">
                                    <Avatar
                                        size={'sm'}
                                        name={x?.user?.fullName as string}
                                        src={x?.user?.profilePicture as string}
                                        border="1px solid white"
                                    />
                                    <Box>
                                        <Text
                                            fontSize=".75rem"
                                            color="#2d3748"
                                            fontWeight={500}
                                        >
                                            {x?.user?.fullName}
                                        </Text>
                                        <Text
                                            fontSize=".75rem"
                                            color="#a6acb3"
                                            fontWeight={400}
                                        >
                                            {x?.user?.email}
                                        </Text>
                                    </Box>
                                </HStack>
                            ),
                        )}
                    </Box>
                </VStack>
                <Box
                    borderRadius=".2rem"
                    border="1px solid #efefef"
                    bgColor="white"
                    w="80%"
                    p="1rem"
                >
                    <Text color="#2d3748" fontSize=".8rem" fontWeight={600}>
                        Sub-Task Assigned To Team Members
                    </Text>
                    <HStack justify="flex-end">
                        <Button
                            onClick={onOpen}
                            bgColor="brand.400"
                            color="white"
                            h="2rem"
                            borderRadius=".3rem"
                            fontSize=".8rem"
                        >
                            Add sub-task
                        </Button>
                    </HStack>
                    <HStack py="1rem" justify="space-between">
                        <HStack>
                            <HStack w="full">
                                <Image
                                    src="/assets/filter.png"
                                    alt="filter"
                                    w="1.1rem"
                                    h="1.1rem"
                                />
                                <Text
                                    fontSize=".8rem"
                                    color="#2d3748"
                                    fontWeight={500}
                                >
                                    Filter By
                                </Text>
                            </HStack>
                            <Select fontSize=".8rem" w="full">
                                <option value="option1">Status</option>
                            </Select>
                        </HStack>

                        <HStack>
                            <SubSearchComponent />
                        </HStack>
                    </HStack>
                    <TableCard tableHead={tableHead}>
                        {tasks?.value?.map((x: ProjectSubTaskView) => {
                            return (
                                <>
                                    <TableRow key={x.id}>
                                        <TableData
                                            name={x?.name}
                                            fontWeight="500"
                                        />
                                        <td style={{ maxWidth: '300px' }}>
                                            <HStack
                                                color="#c2cfe0"
                                                gap=".2rem"
                                                flexWrap="wrap"
                                            >
                                                <Flex
                                                    border="1px solid"
                                                    borderColor="#4FD1C5"
                                                    borderRadius="25px"
                                                    justify="center"
                                                    align="center"
                                                    color="#4FD1C5"
                                                    h="1.6rem"
                                                    px="0.5rem"
                                                >
                                                    {x?.assignee}
                                                </Flex>
                                            </HStack>
                                        </td>
                                        <TableData
                                            name={`${Round(x?.hoursSpent)} Hrs`}
                                            fontWeight="500"
                                        />
                                        <TableData
                                            name={moment(x?.startDate).format(
                                                'DD/MM/YYYY',
                                            )}
                                            fontWeight="500"
                                        />
                                        <TableData
                                            name={moment(x?.endDate).format(
                                                'DD/MM/YYYY',
                                            )}
                                            fontWeight="500"
                                        />
                                        <NewTableState
                                            name={x?.status}
                                            color={colorSwatch(x?.status)}
                                        />
                                        <td>
                                            <Menu>
                                                <MenuButton>
                                                    <Box
                                                        fontSize="1rem"
                                                        pl="1rem"
                                                        fontWeight="bold"
                                                        cursor="pointer"
                                                        color="brand.300"
                                                    >
                                                        {loadings.id == x.id ? (
                                                            <Spinner size="sm" />
                                                        ) : (
                                                            <FaEllipsisH />
                                                        )}
                                                    </Box>
                                                </MenuButton>
                                                <MenuList>
                                                    <MenuItem
                                                        onClick={onOpens}
                                                        w="full"
                                                    >
                                                        <Icon
                                                            as={MdVerified}
                                                            mr=".5rem"
                                                            color="brand.400"
                                                        />
                                                        Mark as complete
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={() =>
                                                            openModal(x)
                                                        }
                                                        w="full"
                                                    >
                                                        <Icon
                                                            as={BsPenFill}
                                                            mr=".5rem"
                                                            color="brand.400"
                                                        />
                                                        Edit Sub-task
                                                    </MenuItem>
                                                </MenuList>
                                            </Menu>
                                        </td>
                                    </TableRow>
                                    {isOpens && (
                                        <ShowPrompt
                                            isOpen={isOpens}
                                            onClose={onCloses}
                                            onSubmit={() =>
                                                markAsCompleted(
                                                    {
                                                        type: 3,
                                                        taskId: x?.id,
                                                        status: x?.status,
                                                    },
                                                    setLoadings,
                                                    toast,
                                                    taskStat,
                                                    router,
                                                    onCloses,
                                                )
                                            }
                                            loading={loading.id === x?.id}
                                            text={`Marking this sub task as complete will prevent any further timesheet submissions for this sub task.<br/> Are you sure you want to proceed?`}
                                        />
                                    )}
                                </>
                            );
                        })}
                    </TableCard>
                    <Box>
                        <HStack borderY="1px solid #D9D9D9" w="full">
                            {['Activity', 'Attachments', 'Hours Spent'].map(
                                (x) => (
                                    <HStack
                                        h="33px"
                                        px="10px"
                                        onClick={() => setCurrentView(x)}
                                        bgColor={
                                            currentView == x
                                                ? '#E9ECEF'
                                                : '#fff'
                                        }
                                        color={
                                            currentView == x
                                                ? '#2383BD'
                                                : '#2D3748'
                                        }
                                    >
                                        <Text fontSize="14px" cursor="pointer">
                                            {x}
                                        </Text>
                                    </HStack>
                                ),
                            )}
                        </HStack>
                        {currentView == 'Activity' && (
                            <AuditTrailSection taskId={task?.id as string} />
                        )}
                        {currentView == 'Attachments' && (
                            <Box py="1rem">
                                <AuditTrailAttachments
                                    taskId={task?.id as string}
                                />
                            </Box>
                        )}
                        {currentView == 'Hours Spent' && (
                            <Box py=".5rem">
                                <TableCard
                                    tableHead={[
                                        'Task Name',
                                        'Team Member',
                                        'Hours Spent',
                                        'Start Date',
                                        'End Date',
                                    ]}
                                >
                                    {userProjectManagementTimesheet?.map(
                                        (x: any) => {
                                            const projectTaskAssigneeName =
                                                x?.project?.assignees?.find(
                                                    (k) =>
                                                        k?.id ===
                                                        x.projectTaskAsigneeId,
                                                );
                                            return (
                                                <TableRow key={x.id}>
                                                    <TableData
                                                        name={task?.name}
                                                        fontWeight="500"
                                                    />
                                                    <TableData
                                                        name={
                                                            projectTaskAssigneeName
                                                                ?.user?.fullName
                                                        }
                                                        fontWeight="500"
                                                    />
                                                    <TableData
                                                        name={`${Round(
                                                            x?.totalHours,
                                                        )} Hrs`}
                                                        fontWeight="500"
                                                    />
                                                    <TableData
                                                        name={moment(
                                                            x?.startDate,
                                                        ).format('DD/MM/YYYY')}
                                                        fontWeight="500"
                                                    />
                                                    <TableData
                                                        name={moment(
                                                            x?.endDate,
                                                        ).format('DD/MM/YYYY')}
                                                        fontWeight="500"
                                                    />
                                                    <td>
                                                        <Menu>
                                                            <MenuButton>
                                                                <Box
                                                                    fontSize="1rem"
                                                                    pl="1rem"
                                                                    fontWeight="bold"
                                                                    cursor="pointer"
                                                                    color="brand.300"
                                                                >
                                                                    {loadings.id ==
                                                                    x.id ? (
                                                                        <Spinner size="sm" />
                                                                    ) : (
                                                                        <FaEllipsisH />
                                                                    )}
                                                                </Box>
                                                            </MenuButton>
                                                            <MenuList>
                                                                <MenuItem
                                                                    onClick={() =>
                                                                        OpenEditTimesheetModal(
                                                                            x,
                                                                        )
                                                                    }
                                                                    w="full"
                                                                >
                                                                    <Icon
                                                                        as={
                                                                            BsPenFill
                                                                        }
                                                                        mr=".5rem"
                                                                        color="brand.400"
                                                                    />
                                                                    Edit
                                                                </MenuItem>
                                                            </MenuList>
                                                        </Menu>
                                                    </td>
                                                </TableRow>
                                            );
                                        },
                                    )}
                                </TableCard>
                            </Box>
                        )}
                    </Box>
                </Box>
            </Flex>
            {isOpen && (
                <AddSubTaskDrawer
                    isOpen={isOpen}
                    onClose={onClose}
                    data={task}
                    subTask={subTask}
                />
            )}
            {isOpened && (
                <ShowPrompt
                    isOpen={isOpened}
                    onClose={onClosed}
                    onSubmit={() =>
                        markAsCompleted(
                            { type: 2, taskId: task.id, status: task?.status },
                            setLoading,
                            toast,
                            setStatus,
                            router,
                            onClosed,
                        )
                    }
                    loading={loading?.id == task.id}
                    text={`Marking this task as complete will prevent any further timesheet submissions for this task.<br/> Are you sure you want to proceed?`}
                />
            )}
            {openEditTimesheetModal && (
                <UpdateTimesheetModal
                    task={task}
                    subTask={tasks?.value}
                    isOpen={openEditTimesheetModal}
                    onClose={() => setOpenEditTimeSheetModal(false)}
                    taskPriorityList={taskPriorityList}
                    projectTaskAssigneeId={ProjectTimesheetAssigneeId}
                    selectedTimesheet={selectedTimesheet}
                    sliderValue={editTimesheetSliderValue}
                    setSliderValue={setEditTimesheetSliderValue}
                    projectId={project?.id}
                    addToTimesheet={addToTimesheet}
                    totalHoursSpent={task?.hoursSpent}
                />
            )}
        </Box>
    );
};
