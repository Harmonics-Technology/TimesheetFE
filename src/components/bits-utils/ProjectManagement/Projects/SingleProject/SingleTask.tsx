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
} from '@chakra-ui/react';
import { SubSearchComponent } from '@components/bits-utils/SubSearchComponent';
import {
    TableRow,
    TableData,
    NewTableState,
} from '@components/bits-utils/TableData';
import colorSwatch from '@components/generics/colorSwatch';
import moment from 'moment';
import React, { useState } from 'react';
import { BiSolidPencil } from 'react-icons/bi';
import { FaEllipsisH, FaEye } from 'react-icons/fa';
import { ProgressBar } from '../../Generics/ProgressBar';
import { TableCard } from '../../Generics/TableCard';
import { StatusBadge } from '../../Generics/StatusBadge';
import { TopBar } from './TopBar';
import { AddSubTaskDrawer } from '../../Modals/AddSubTaskDrawer';
import {
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

export const SingleTask = ({
    id,
    project,
    tasks,
    task,
    users,
}: {
    id: any;
    project: any;
    tasks: any;
    task: ProjectTaskView;
    users: any;
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
    const [loading, setLoading] = useState();
    const toast = useToast();

    const [subTask, setSubTask] = useState<ProjectSubTaskView>({});
    const [status, setStatus] = useState(task?.status);

    const openModal = (item: any) => {
        setSubTask(item);
        onOpen();
    };
    //
    return (
        <Box>
            <TopBar id={id} data={project} users={users} />
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
                            <ProgressBar
                                barWidth={task?.progress}
                                showProgress={true}
                                barColor={'brand.400'}
                                leftText="Task Status"
                                rightText={`${Round(task?.progress)}%`}
                            />
                        </Box>
                        <Flex mt="1rem" justify="flex-end">
                            <ManageBtn
                                onClick={() =>
                                    markAsCompleted(
                                        { type: 2, taskId: task.id },
                                        setLoading,
                                        toast,
                                        setStatus,
                                    )
                                }
                                isLoading={loading}
                                btn="Mark Task as Complete"
                                bg="brand.400"
                                w="fit-content"
                                disabled={status == 'Completed'}
                            />
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
                            const [taskStatus, setTaskStatus] = useState(
                                x?.status,
                            );
                            return (
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
                                                {
                                                    x?.projectTaskAsignee?.user
                                                        ?.fullName
                                                }
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
                                                    {loading ? (
                                                        <Spinner size="sm" />
                                                    ) : (
                                                        <FaEllipsisH />
                                                    )}
                                                </Box>
                                            </MenuButton>
                                            <MenuList>
                                                <MenuItem
                                                    onClick={() =>
                                                        markAsCompleted(
                                                            {
                                                                type: 3,
                                                                taskId: x?.id,
                                                            },
                                                            setLoading,
                                                            toast,
                                                            setTaskStatus,
                                                        )
                                                    }
                                                    w="full"
                                                    disabled={
                                                        taskStatus ==
                                                        'Completed'
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
                                                    onClick={() => openModal(x)}
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
                            );
                        })}
                    </TableCard>
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
        </Box>
    );
};
