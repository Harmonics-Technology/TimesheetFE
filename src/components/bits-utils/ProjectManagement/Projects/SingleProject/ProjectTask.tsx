import {
    Box,
    Button,
    HStack,
    Image,
    Select,
    Text,
    useDisclosure,
    Icon,
    Flex,
    Menu,
    MenuButton,
    Spinner,
    MenuList,
    MenuItem,
    useToast,
} from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { TopBar } from './TopBar';
import { SubSearchComponent } from '@components/bits-utils/SubSearchComponent';
import { TableCard } from '../../Generics/TableCard';
import {
    TableRow,
    TableData,
    NewTableState,
} from '@components/bits-utils/TableData';
import moment from 'moment';
import colorSwatch from '@components/generics/colorSwatch';
import { BiSolidPencil } from 'react-icons/bi';
import { FaEllipsisH, FaEye } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { UserContext } from '@components/context/UserContext';
import { AddNewTaskDrawer } from '../../Modals/AddNewTaskDrawer';
import {
    ProjectTaskAsigneeView,
    ProjectView,
    ProjectTaskView,
    ProjectManagementService,
} from 'src/services';
import { Round } from '@components/generics/functions/Round';
import Pagination from '@components/bits-utils/Pagination';
import { ShowPrompt } from '../../Modals/ShowPrompt';

export const ProjectTask = ({
    id,
    project,
    tasks,
    users,
    currencies,
}: {
    id: any;
    project: ProjectView;
    tasks: any;
    users: any;
    currencies: any;
}) => {
    const tableHead = [
        'Task Name',
        'Task assigned to',
        'Hours spent',
        'Start Date',
        'Sub Task',
        'Status',
        'Actions',
    ];
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();

    const { user } = useContext(UserContext);
    const role = user?.role?.replaceAll(' ', '');
    const [data, setData] = useState({ isEdit: false, raw: {} });

    const openModal = (item: any) => {
        setData({ isEdit: true, raw: item });
        onOpen();
    };

    const filterByStatus = (value) => {
        router.push({
            query: {
                ...router.query,
                status: value,
            },
        });
    };

    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const {
        isOpen: isOpened,
        onOpen: onOpened,
        onClose: onClosed,
    } = useDisclosure();

    const openPrompt = (item: any) => {
        setData({ isEdit: false, raw: item });
        onOpened();
    };

    const deleteTask = async () => {
        setLoading(true);
        const taskId = data.raw as any;
        try {
            const res = await ProjectManagementService.deleteProjectTask(
                taskId.id,
            );
            if (res.status) {
                setLoading(false);
                toast({
                    title: res.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.replace(router.asPath);
                onClosed();
                return;
            }
        } catch (err: any) {
            setLoading(false);
            toast({
                title: err?.body?.message || err?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    return (
        <Box>
            <TopBar
                currencies={currencies}
                id={id}
                data={project}
                users={users}
            />
            <HStack py="1rem" justify="space-between">
                <HStack w="30%">
                    <HStack w="fit-content">
                        <Image
                            src="/assets/filter.png"
                            alt="filter"
                            w="1.1rem"
                            h="1.1rem"
                        />
                        <Text fontSize=".8rem" color="#2d3748" fontWeight={500}>
                            Filter By
                        </Text>
                    </HStack>
                    <Select
                        fontSize=".8rem"
                        w="fit-content"
                        onChange={(e) => filterByStatus(e?.target.value)}
                    >
                        <option value="">All</option>
                        <option value="1">Not Started</option>
                        <option value="2">Ongoing</option>
                        <option value="3">Completed</option>
                    </Select>
                </HStack>

                <HStack>
                    <Button
                        onClick={onOpen}
                        bgColor="brand.400"
                        color="white"
                        h="2rem"
                        borderRadius=".3rem"
                        fontSize=".8rem"
                    >
                        Add new task
                    </Button>
                    <SubSearchComponent />
                </HStack>
            </HStack>
            <Box>
                <TableCard tableHead={tableHead}>
                    {tasks?.value?.map((x: ProjectTaskView, i) => {
                        const viewTask = () =>
                            router.push(
                                `/${role}/project-management/projects/${id}/project-task/${x?.id}`,
                            );
                        return (
                            <TableRow key={i}>
                                <TableData
                                    name={x?.name}
                                    fontWeight="500"
                                    full
                                    breakWord
                                    onClick={viewTask}
                                />
                                <td
                                    style={{ maxWidth: '300px' }}
                                    onClick={viewTask}
                                >
                                    <HStack
                                        color="#c2cfe0"
                                        gap=".2rem"
                                        flexWrap="wrap"
                                    >
                                        {x?.assignees?.map(
                                            (x: ProjectTaskAsigneeView, i) => (
                                                <Flex
                                                    key={i}
                                                    border="1px solid"
                                                    borderColor="#4FD1C5"
                                                    borderRadius="25px"
                                                    justify="center"
                                                    align="center"
                                                    color="#4FD1C5"
                                                    h="1.6rem"
                                                    px="0.5rem"
                                                >
                                                    {x.user?.fullName}
                                                </Flex>
                                            ),
                                        )}
                                    </HStack>
                                </td>
                                <TableData
                                    name={`${Round(x?.hoursSpent)} Hrs`}
                                    fontWeight="500"
                                    onClick={viewTask}
                                />
                                <TableData
                                    name={moment(x?.startDate).format(
                                        'DD/MM/YYYY',
                                    )}
                                    fontWeight="500"
                                    onClick={viewTask}
                                />
                                <TableData
                                    name={x?.subTaskCount}
                                    fontWeight="500"
                                    onClick={viewTask}
                                />
                                <NewTableState
                                    name={x?.status}
                                    color={colorSwatch(x?.status)}
                                />
                                <td>
                                    {/* <HStack color="#c2cfe0">
                                        <Icon as={FaEye} onClick={viewTask} />
                                        <Icon
                                            as={BiSolidPencil}
                                            onClick={() => openModal(x)}
                                        />
                                    </HStack> */}
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
                                        <MenuList w="full" fontSize=".7rem">
                                            <MenuItem
                                                onClick={() => viewTask()}
                                                w="full"
                                            >
                                                View Task
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => openModal(x)}
                                                w="full"
                                            >
                                                Edit Task
                                            </MenuItem>
                                            <MenuItem
                                                onClick={() => openPrompt(x)}
                                                w="full"
                                            >
                                                Delete
                                            </MenuItem>
                                        </MenuList>
                                    </Menu>
                                </td>
                            </TableRow>
                        );
                    })}
                </TableCard>
                <Pagination data={tasks} loadMore />
            </Box>
            {isOpen && (
                <AddNewTaskDrawer
                    isOpen={isOpen}
                    onClose={onClose}
                    data={data.raw}
                    project={project}
                    isEdit={data.isEdit}
                    setData={setData}
                />
            )}
            {isOpened && (
                <ShowPrompt
                    isOpen={isOpened}
                    onClose={onClosed}
                    onSubmit={deleteTask}
                    loading={loading}
                    text={`Are you sure you want to delete this task?`}
                />
            )}
        </Box>
    );
};
