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
} from '@chakra-ui/react';
import { SubSearchComponent } from '@components/bits-utils/SubSearchComponent';
import {
    TableRow,
    TableData,
    NewTableState,
} from '@components/bits-utils/TableData';
import colorSwatch from '@components/generics/colorSwatch';
import moment from 'moment';
import React from 'react';
import { BiSolidPencil } from 'react-icons/bi';
import { FaEye } from 'react-icons/fa';
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

export const SingleTask = ({
    id,
    project,
    tasks,
    task,
}: {
    id: any;
    project: any;
    tasks: any;
    task: ProjectTaskView;
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
    // console.log({ task });
    return (
        <Box>
            <TopBar id={id} data={project} />
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
                        {tasks?.value?.map((x: ProjectSubTaskView) => (
                            <TableRow key={x.id}>
                                <TableData
                                    name={x?.projectTask?.name}
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
                                    name={`${x?.hoursSpent} Hrs`}
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
                                    <HStack color="#c2cfe0">
                                        <Icon as={FaEye} />
                                        <Icon as={BiSolidPencil} />
                                    </HStack>
                                </td>
                            </TableRow>
                        ))}
                    </TableCard>
                </Box>
            </Flex>
            {isOpen && (
                <AddSubTaskDrawer
                    isOpen={isOpen}
                    onClose={onClose}
                    data={task}
                />
            )}
        </Box>
    );
};
