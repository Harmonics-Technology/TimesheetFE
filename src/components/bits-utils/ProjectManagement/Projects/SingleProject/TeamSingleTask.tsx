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
    MenuButton,
    Spinner,
    MenuList,
    MenuItem,
    Menu,
    useToast,
} from '@chakra-ui/react';
import { SubSearchComponent } from '@components/bits-utils/SubSearchComponent';
import {
    TableRow,
    TableData,
    NewTableState,
} from '@components/bits-utils/TableData';
import colorSwatch from '@components/generics/colorSwatch';
import moment from 'moment';
import React, { useContext, useState } from 'react';
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
import { TeamTopBar } from './TeamTopBar';
import { MdVerified } from 'react-icons/md';
import { BsPenFill } from 'react-icons/bs';
import { UserContext } from '@components/context/UserContext';
import { ManageBtn } from '@components/bits-utils/ManageBtn';
import markAsCompleted from '@components/generics/functions/markAsCompleted';
import { ShowPrompt } from '../../Modals/ShowPrompt';
import { useRouter } from 'next/router';
import { ProgressSlider } from '@components/bits-utils/ProgressSlider';
import { GiProgression } from 'react-icons/gi';
import { AuditTrailSection } from '@components/subpages/AuditTrailSection';
import { AuditTrailAttachments } from '@components/subpages/AuditTrailAttachments';

export const TeamSingleTask = ({
    id,
    project,
    tasks,
    task,
    access,
    pm,
}: {
    id: any;
    project: any;
    tasks: any;
    task: any;
    access: any;
    pm: any;
}) => {
    const tableHead = [
        'Subtask Name',
        'Hours Spent',
        'Start Date',
        'End Date',
        'Workdone',
        'Status',
    ];
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [currentView, setCurrentView] = useState('Activity');
    const {
        isOpen: isOpened,
        onOpen: onOpened,
        onClose: onClosed,
    } = useDisclosure();
    const {
        isOpen: isOpener,
        onOpen: onOpener,
        onClose: onCloser,
    } = useDisclosure();
    const [subTask, setSubTask] = useState<ProjectSubTaskView>({});

    const openModal = (item: any) => {
        setSubTask({ ...item, isEdit: true });
        onOpen();
    };
    const progressModal = (item: any) => {
        setSubTask(item);
        onOpener();
    };

    const pastDate = moment().diff(moment(task?.endDate), 'days') > 0;
    const [taskStatus, setTaskStatus] = useState();
    const [status, setStatus] = useState(task?.status?.toLowerCase());
    const toast = useToast();
    const router = useRouter();
    const {
        isOpen: isOpens,
        onOpen: onOpens,
        onClose: onCloses,
    } = useDisclosure();

    const [loadings, setLoadings] = useState({ id: '' });
    const [loading, setLoading] = useState({ id: '' });

    const { user } = useContext(UserContext);
    const role = user?.role?.replaceAll(' ', '');

    const isPm = project?.projectManagerId == user?.id;
    const hasAccess =
        access?.projectMembersTaskCreation ||
        (access?.assignedPMTaskCreation && isPm);
    const isOrgPm = pm.value.find((x) => x.id == user?.id);

    const [sliderValue, setSliderValue] = useState(
        task?.percentageOfCompletion,
    );

    const updateProgress = async () => {
        setLoading({ id: 'update' });
        try {
            const data = await ProjectManagementService.updateTaskProgress(
                task?.id,
                sliderValue,
            );
            if (data.status) {
                setLoading({ id: '' });
                router.replace(router.asPath);
                toast({
                    title: data.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                return;
            }
            setLoading({ id: '' });
            toast({
                title: data.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (err: any) {
            setLoading({ id: '' });
            toast({
                title: err?.body?.message || err.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    return (
        <Box>
            <TeamTopBar data={project} />
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
                        <Box w="full" mt="0.5rem">
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
                                leftText="Task Status"
                                rightText={`${Round(
                                    task?.percentageOfCompletion,
                                )}%`}
                            /> */}
                            <ProgressSlider
                                sliderValue={sliderValue}
                                setSliderValue={setSliderValue}
                                leftText="Task Status"
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
                        </Box>
                        <Flex mt="1rem" justify="space-between">
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
                            {(isPm || isOrgPm) && (
                                <ManageBtn
                                    onClick={onOpened}
                                    isLoading={loading.id == task?.id}
                                    btn="Mark Task as Complete"
                                    bg="brand.400"
                                    w="fit-content"
                                    disabled={status == 'completed'}
                                />
                            )}
                        </Flex>
                    </Box>
                    <VStack
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
                    </VStack>
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
                    w="75%"
                    p="1rem"
                >
                    <Text color="#2d3748" fontSize=".8rem" fontWeight={600}>
                        My Task
                    </Text>
                    <HStack justify="flex-end">
                        {hasAccess && (
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
                        )}
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
                    {/* <TableCard tableHead={tableHead}>
                        {tasks?.value?.map((x: ProjectTaskView) => {
                            const priority = x?.taskPriority?.toLowerCase();
                            return (
                                <TableRow key={x.id}>
                                    <TableData
                                        name={x?.name}
                                        fontWeight="500"
                                        full
                                        breakWord
                                    />

                                    <TableData
                                        name={priority}
                                        fontWeight="500"
                                        customColor={
                                            priority == 'high'
                                                ? 'red'
                                                : priority == 'normal'
                                                ? 'brand.700'
                                                : 'brand.600'
                                        }
                                    />
                                    <TableData
                                        name={moment(x?.endDate).format(
                                            'DD/MM/YYYY',
                                        )}
                                        fontWeight="500"
                                    />
                                    <td>
                                        <Box
                                            border="1px solid #A6ACBE"
                                            borderRadius=".25rem"
                                            color="#a6a6a6"
                                            fontSize=".6rem"
                                            p=".4rem .75rem"
                                            w="50%"
                                        >
                                            {x.percentageOfCompletion}%
                                        </Box>
                                    </td>
                                    <NewTableState
                                        name={x?.status}
                                        color={colorSwatch(x?.status)}
                                    />
                                </TableRow>
                            );
                        })}
                    </TableCard> */}
                    <TableCard tableHead={tableHead}>
                        {tasks?.value?.map((x: ProjectSubTaskView) => {
                            return (
                                <TableRow key={x.id}>
                                    <TableData
                                        name={x?.name}
                                        fontWeight="500"
                                    />
                                    {/* <td style={{ maxWidth: '300px' }}>
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
                                    </td> */}
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
                                    <TableData
                                        name={`${x?.percentageOfCompletion}%`}
                                        fontWeight="500"
                                    />
                                    <NewTableState
                                        name={x?.status}
                                        color={colorSwatch(x?.status)}
                                    />
                                    {hasAccess && (
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
                                                        isDisabled={
                                                            taskStatus ||
                                                            x?.status?.toLowerCase() ==
                                                                'completed'
                                                        }
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
                                                    <MenuItem
                                                        onClick={() =>
                                                            progressModal(x)
                                                        }
                                                        w="full"
                                                    >
                                                        <Icon
                                                            as={GiProgression}
                                                            mr=".5rem"
                                                            color="brand.400"
                                                        />
                                                        Update Progress
                                                    </MenuItem>
                                                </MenuList>
                                            </Menu>
                                        </td>
                                    )}
                                </TableRow>
                            );
                        })}
                    </TableCard>
                    <Box>
                        <HStack borderY="1px solid #D9D9D9" w="full">
                            {['Activity', 'Attachments'].map((x) => (
                                <HStack
                                    h="33px"
                                    px="10px"
                                    onClick={() => setCurrentView(x)}
                                    bgColor={
                                        currentView == x ? '#E9ECEF' : '#fff'
                                    }
                                    color={
                                        currentView == x ? '#2383BD' : '#2D3748'
                                    }
                                >
                                    <Text fontSize="14px" cursor="pointer">
                                        {x}
                                    </Text>
                                </HStack>
                            ))}
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
                            { type: 2, taskId: task.id },
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
            {isOpener && (
                <ShowPrompt
                    isOpen={isOpener}
                    onClose={onCloser}
                    text={`Update progress`}
                    isProgress={true}
                    data={subTask}
                />
            )}
        </Box>
    );
};
