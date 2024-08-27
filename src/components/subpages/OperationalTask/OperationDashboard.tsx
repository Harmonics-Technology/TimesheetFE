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
import React, { useContext, useRef, useState } from 'react';
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
    UserService,
} from 'src/services';
import { EditOpTaskDrawer } from './EditOpTaskDrawer';
import { useNonInitialEffect } from '@components/generics/useNonInitialEffect';
import Pagination from '@components/bits-utils/Pagination';
import { UserContext } from '@components/context/UserContext';

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
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
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
    const [opTaskItem, setOpTaskItem] = useState(projects);
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
    const [filter, setFilter] = useState<any>('');
    const [deptUsers, setDeptUsers] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchDeptUser = async (value: any) => {
        try {
            setIsLoading(true);
            const data = await UserService.listUsersByDepartment(
                superAdminId,
                0,
                100,
                value,
            );
            if (data.status) {
                setIsLoading(false);
                setDeptUsers(data.data?.value);
            }
        } catch (error) {
            setIsLoading(false);
            console.log({ error });
        }
    };
    const filterByStatus = (value) => {
        setFilter(value);
        // if (value == '2' && role != 'TeamMember') {
        //     return;
        // }
        if (value == '2' && role == 'TeamMember') {
            router.push({
                query: {
                    ...router.query,
                    department: user?.department,
                    status: 2,
                },
            });
            fetchDeptUser(user?.department);
            return;
        }
        router.push({
            query: {
                ...router.query,
                status: value,
            },
        });
    };

    const filterByDepartment = (value) => {
        router.push({
            query: {
                ...router.query,
                department: value,
                status: 2,
            },
        });
        fetchDeptUser(value);
    };
    const filterByUser = (value) => {
        router.push({
            query: {
                ...router.query,
                subId: value,
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
            department: task.department,
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

    const getCount = (status: string) => {
        return (
            opTaskItem?.filter(
                (x: ProjectTaskView) => x?.operationalTaskStatus == status,
            )?.length || 0
        );
    };

    const renderItems = (status: string) => {
        return opTaskItem
            ?.filter((x: ProjectTaskView) => x?.operationalTaskStatus == status)
            .map((task: ProjectTaskView) => (
                <OperationCard
                    key={task?.id}
                    id={task?.id}
                    bg={
                        task?.isAssignedToMe && task?.createdByUserId == id
                            ? '#2383BD'
                            : '#FFA681'
                    }
                    text={
                        task?.isAssignedToMe && task?.createdByUserId == id
                            ? 'Private Task'
                            : 'Task Assigned'
                    }
                    title={task?.name}
                    sub={task?.note}
                    subBtm={`Due Date ; ${moment(task?.endDate).format(
                        'DD-MM-YYYY',
                    )}`}
                    user={task?.createdByUser}
                    assignees={task?.assignees?.filter((x) => !x?.disabled)}
                    onClick={() => triggerEditCard(task)}
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={(e) => handleDragEnd(e)}
                />
            ));
    };

    const { department, status, subId } = router?.query;

    // console.log(
    //     users?.value?.filter((x) => x?.department == department),
    //     users,
    // );

    useNonInitialEffect(() => {
        setOpTaskItem(projects);
    }, [projects]);

    return (
        <Box bgColor="white" borderRadius="6px" p="2rem">
            <HStack justify="space-between" align="center">
                <HStack gap="15px">
                    <Select
                        fontSize=".8rem"
                        w="fit-content"
                        onChange={(e) => filterByStatus(e?.target.value)}
                        value={status}
                    >
                        <option value="">All</option>
                        <option value="1">Private</option>
                        <option value="2">Departmental</option>
                        <option value="3">Others</option>
                    </Select>
                    {(filter == '2' || status == '2') &&
                        role != 'TeamMember' && (
                            <Select
                                fontSize=".8rem"
                                w="fit-content"
                                onChange={(e) =>
                                    filterByDepartment(e?.target.value)
                                }
                                value={department}
                            >
                                <option value="">Select Department</option>
                                <option value="">All</option>
                                {departments?.map((x) => (
                                    <option value={x.name}>{x.name}</option>
                                ))}
                            </Select>
                        )}
                    {department && (
                        <Select
                            fontSize=".8rem"
                            w="fit-content"
                            onChange={(e) => filterByUser(e?.target.value)}
                            value={subId}
                        >
                            <option value="">Select A User</option>
                            <option value="">All</option>
                            {deptUsers?.map((x) => (
                                <option value={x.id}>{x.fullName}</option>
                            ))}
                        </Select>
                    )}

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
                    num={getCount('To Do')}
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
                    num={getCount('In Progress')}
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
                    num={getCount('Completed')}
                    onDrop={(e) => handleOnDrop(e, 'Completed')}
                    onDragOver={handleDragOver}
                >
                    <VStack w="full" align="flex-start">
                        {renderItems('Completed')}
                    </VStack>
                </ContainerBox>
            </Grid>
            {/* <Pagination data={projects} loadMore /> */}
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
                    departments={departments}
                />
            )}
        </Box>
    );
};
