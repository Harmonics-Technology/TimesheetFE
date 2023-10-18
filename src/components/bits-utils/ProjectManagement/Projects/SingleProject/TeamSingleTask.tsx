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

export const TeamSingleTask = ({
    id,
    project,
    tasks,
}: {
    id: any;
    project: any;
    tasks: any;
}) => {
    const tableHead = [
        'Task/Subtak Name',
        'Task Priority',
        'Task Due Date',
        'Percentage Of  Completion',
        'Status',
    ];
    const { isOpen, onOpen, onClose } = useDisclosure();

    const status = tasks?.status?.toLowerCase();

    return (
        <Box>
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
                            {project?.name}
                        </Text>
                        <Text
                            color="#8c8c8c"
                            fontSize=".68rem"
                            fontWeight={400}
                            my="1rem"
                        >
                            {project?.note}
                        </Text>
                        <Box w="full" mt="0.5rem">
                            <ProgressBar
                                barWidth={project?.progress}
                                showProgress={true}
                                barColor={
                                    status == 'completed'
                                        ? 'brand.400'
                                        : status == 'ongoing'
                                        ? '#f7e277'
                                        : status == 'ongoing' && pastDate
                                        ? 'red'
                                        : status == 'not started'
                                        ? 'gray.100'
                                        : 'red'
                                }
                                leftText="project Status"
                                rightText={`${Round(project?.progress)}%`}
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
                            text={moment(project?.startDate).format(
                                'DD MMM YYYY',
                            )}
                        />
                        <StatusBadge
                            bg="#FFA681"
                            title="Deadline:"
                            text={moment(project?.endDate).format(
                                'DD MMM YYYY',
                            )}
                        />
                        <StatusBadge
                            bg="#4BAEEA"
                            title="Status:"
                            text={project?.status}
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

                        {project?.assignees
                            ?.filter((b) => b.projectTaskId == null)
                            ?.map((x: ProjectTaskAsigneeView, i) => (
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
                            ))}
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
                        My Task
                    </Text>
                    {/* <HStack justify="flex-end">
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
                    </HStack> */}
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
                                            {x.progress}%
                                        </Box>
                                    </td>
                                    <NewTableState
                                        name={x?.status}
                                        color={colorSwatch(x?.status)}
                                    />
                                </TableRow>
                            );
                        })}
                    </TableCard>
                </Box>
            </Flex>
        </Box>
    );
};
