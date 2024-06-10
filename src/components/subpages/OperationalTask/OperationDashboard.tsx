import {
    Box,
    Button,
    Grid,
    HStack,
    Icon,
    Select,
    VStack,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import React, { useRef, useState } from 'react';
import { ContainerBox } from './ContainerBox';
import { OperationCard } from './OperationCard';
import moment from 'moment';
import { useRouter } from 'next/router';
import { FaRegCalendarAlt } from 'react-icons/fa';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import { AddOpTaskDrawer } from './AddOpTaskDrawer';
import {
    ProjectManagementService,
    ProjectProgressCountView,
    ProjectTaskView,
} from 'src/services';
import { EditOpTaskDrawer } from './EditOpTaskDrawer';
import { useNonInitialEffect } from '@components/generics/useNonInitialEffect';

export const OperationDashboard = ({
    superAdminId,
    users,
    counts,
    projects,
    id,
    departments,
}: {
    users: any;
    superAdminId: string;
    counts: ProjectProgressCountView;
    projects: any;
    id?: any;
    departments: any;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isEditOpen,
        onOpen: onEditOpen,
        onClose: onEditClose,
    } = useDisclosure();
    const [cardData, setCardData] = useState();
    const triggerEditCard = (value: any) => {
        setCardData(value);
        onEditOpen();
    };
    const [date, setDate] = useState<any>([
        new DateObject().subtract(4, 'days'),
        new DateObject().add(4, 'days'),
    ]);
    // console.log({ projects });
    const [opTaskItem, setOpTaskItem] = useState(projects?.value);
    const router = useRouter();
    const dateRef = useRef<any>();
    const filterByDate = (value) => {
        router.push({
            query: {
                ...router.query,
                from: value[0].format('YYYY-MM-DD'),
                to: value[1].format('YYYY-MM-DD'),
            },
        });
        dateRef.current.closeCalendar();
    };
    const filterByStatus = (value) => {
        router.push({
            query: {
                ...router.query,
                status: value,
            },
        });
    };

    const updateTaskStatus = async (task: any, status: string) => {
        const reformattedTask = {
            superAdminId: task.superAdminId,
            isAssignedToMe: task.isAssignedToMe,
            isOperationalTask: true,
            name: task.name,
            id: task.id,
            startDate: task.startDate,
            endDate: task.endDate,
            note: task.note,
            operationalTaskStatus: status,
            assignedUsers: (task?.assignees as any).map((x) => x.userId) || [],
        };
        try {
            const result = await ProjectManagementService.updateTask(
                reformattedTask,
            );
            if (result.status) {
                router.replace(router.asPath);
                return;
            }
            return;
        } catch (err: any) {
            console.log({ err });
        }
    };

    const handleDragStart = (e: React.DragEvent, data: any) => {
        e.dataTransfer.setData('task-item', JSON.stringify(data));
    };
    const handleDragEnd = (e: React.DragEvent) => {
        e.dataTransfer.clearData();
    };
    const handleOnDrop = (e: React.DragEvent, status: string) => {
        e.preventDefault();
        const task = e.dataTransfer.getData('task-item');
        const parsedTask = JSON.parse(task);
        setOpTaskItem((prev) => {
            return prev.map((x) => {
                if (x?.id == parsedTask?.id) {
                    return { ...x, operationalTaskStatus: status };
                }
                return x;
            });
        });
        updateTaskStatus(parsedTask, status);
    };
    const handleDragOver = (e: any) => {
        e.preventDefault();
    };

    const renderItems = (status: string) => {
        return opTaskItem
            ?.filter((x: ProjectTaskView) => x?.operationalTaskStatus == status)
            .map((task: ProjectTaskView) => (
                <OperationCard
                    key={task?.id}
                    bg={
                        task?.isAssignedToMe &&
                        task?.assignees?.at(0)?.userId == id
                            ? '#2383BD'
                            : '#FFA681'
                    }
                    text={
                        task?.isAssignedToMe &&
                        task?.assignees?.at(0)?.userId == id
                            ? 'My Task'
                            : 'Task Assigned'
                    }
                    title={task?.name}
                    sub={task?.note}
                    subBtm={`Due Date ; ${moment(task?.endDate).format(
                        'DD-MM-YYYY',
                    )}`}
                    isMine={task?.isAssignedToMe}
                    onClick={() => triggerEditCard(task)}
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={(e) => handleDragEnd(e)}
                />
            ));
    };

    useNonInitialEffect(() => {
        setOpTaskItem(projects?.value);
    }, [projects]);

    return (
        <Box bgColor="white" borderRadius="6px" p="2rem">
            <HStack justify="space-between" align="center">
                <HStack gap="15px">
                    <Select
                        fontSize=".8rem"
                        w="fit-content"
                        onChange={(e) => filterByStatus(e?.target.value)}
                    >
                        <option value="">All</option>
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </Select>
                    <DatePicker
                        value={date}
                        onChange={setDate}
                        range
                        ref={dateRef}
                        onPropsChange={(e) =>
                            // @ts-ignore
                            e?.value?.length > 1 && filterByDate(e?.value)
                        }
                        format="MMM DD, YYYY"
                        render={(stringDates, openCalendar) => {
                            const from = stringDates[0] || '';
                            const to = stringDates[1] || '';
                            const value =
                                from && to
                                    ? from + ' - ' + to
                                    : from + ' - ' + from;
                            return (
                                <HStack
                                    w="fit-content"
                                    px="1rem"
                                    h="2.5rem"
                                    justifyContent="center"
                                    alignItems="center"
                                    border="1px solid"
                                    borderColor="#a6a6a6"
                                    color="gray.500"
                                    boxShadow="sm"
                                    borderRadius="7px"
                                    cursor="pointer"
                                    fontSize=".9rem"
                                    bgColor="white"
                                    onClick={openCalendar}
                                >
                                    <Icon as={FaRegCalendarAlt} />
                                    <Text mb="0" whiteSpace="nowrap">
                                        {value}
                                    </Text>
                                </HStack>
                            );
                        }}
                    />
                </HStack>
                <Button
                    onClick={onOpen}
                    bgColor="brand.400"
                    color="white"
                    h="2rem"
                    borderRadius=".3rem"
                    fontSize=".8rem"
                >
                    Add task
                </Button>
            </HStack>
            <Grid
                templateColumns={['1fr', 'repeat(3, 1fr)']}
                gap="15px"
                w="full"
                mt="2rem"
            >
                <ContainerBox
                    bg="#2383BD"
                    text="To Do"
                    num={counts?.notStarted}
                    onDrop={(e) => handleOnDrop(e, 'To Do')}
                    onDragOver={handleDragOver}
                >
                    <VStack w="full" align="flex-start">
                        {renderItems('To Do')}
                    </VStack>
                </ContainerBox>

                <ContainerBox
                    bg="#FFA500"
                    text="In Progress"
                    num={counts?.inProgress}
                    onDrop={(e) => handleOnDrop(e, 'In Progress')}
                    onDragOver={handleDragOver}
                >
                    <VStack w="full" align="flex-start">
                        {renderItems('In Progress')}
                    </VStack>
                </ContainerBox>
                <ContainerBox
                    bg="brand.400"
                    text="Completed"
                    num={counts?.completed}
                    onDrop={(e) => handleOnDrop(e, 'Completed')}
                    onDragOver={handleDragOver}
                >
                    <VStack w="full" align="flex-start">
                        {renderItems('Completed')}
                    </VStack>
                </ContainerBox>
            </Grid>
            {isOpen && (
                <AddOpTaskDrawer
                    isOpen={isOpen}
                    onClose={onClose}
                    superAdminId={superAdminId}
                    users={users}
                    id={id}
                    departments={departments}
                />
            )}
            {isEditOpen && (
                <EditOpTaskDrawer
                    isOpen={isEditOpen}
                    onClose={onEditClose}
                    superAdminId={superAdminId}
                    users={users}
                    data={cardData}
                    id={id}
                />
            )}
        </Box>
    );
};
