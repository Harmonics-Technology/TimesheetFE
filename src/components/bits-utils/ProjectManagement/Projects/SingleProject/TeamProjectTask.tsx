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
    MenuItem,
    MenuList,
    Spinner,
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
    ProjectManagementSettingView,
    ProjectManagementService,
} from 'src/services';
import { Round } from '@components/generics/functions/Round';
import { TeamTopBar } from './TeamTopBar';
import Pagination from '@components/bits-utils/Pagination';
import { MdDeleteOutline } from 'react-icons/md';
import { ShowPrompt } from '../../Modals/ShowPrompt';

export const TeamProjectTask = ({
    id,
    project,
    tasks,
    users,
    access,
    isOrgPm,
}: {
    id: any;
    project: ProjectView;
    tasks: any;
    users: any;
    access: ProjectManagementSettingView;
    isOrgPm?: boolean;
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
    const [data, setData] = useState({
        isEdit: false,
        raw: {} as ProjectTaskView,
    });

    const openModal = (item: any) => {
        setData({ isEdit: true, raw: item });
        onOpen();
    };

    const isPm = project?.projectManagers?.find((x) => x?.user?.id == user?.id);
    const hasAccess =
        access?.projectMembersTaskCreation ||
        (access.assignedPMTaskCreation && isPm) ||
        isOrgPm ||
        (access?.clientTaskCreation && user?.role == 'client') ||
        (access?.supervisorTaskCreation && user?.role == 'Supervisor');
    const editAccess =
        (access?.pmTaskEditing && isPm) ||
        isOrgPm ||
        access.projectMembersTaskEditing ||
        access.taskMembersTaskEditing;

    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const {
        isOpen: isOpened,
        onOpen: onOpened,
        onClose: onClosed,
    } = useDisclosure();
    const {
        isOpen: isOpens,
        onOpen: onOpens,
        onClose: onCloses,
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
                onCloses();
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
        } finally {
            onCloses();
        }
    };

    const checkPossibleDeletion = () => {
        if (data?.raw?.createdByUserId != user?.id) {
            toast({
                title: 'You do not have the permission to delete this task. Kindly contact your admin',
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            onClosed();
            return;
        }
        onClosed();
        onOpens();
    };

    return (
        <Box>
            <TeamTopBar data={project} id={id} />
            <HStack py="1rem" justify="space-between">
                <HStack w="17%">
                    <HStack w="full">
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
                    <Select fontSize=".8rem" w="full">
                        <option value="option1">Status</option>
                    </Select>
                </HStack>

                <HStack>
                    {hasAccess && (
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
                    )}
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
                                            {editAccess && (
                                                <MenuItem
                                                    onClick={() => openModal(x)}
                                                    w="full"
                                                >
                                                    Edit Task
                                                </MenuItem>
                                            )}
                                            {hasAccess && (
                                                <MenuItem
                                                    onClick={() =>
                                                        openPrompt(x)
                                                    }
                                                    w="full"
                                                >
                                                    Delete
                                                </MenuItem>
                                            )}
                                        </MenuList>
                                    </Menu>
                                    {/* <HStack color="#333333">
                                        <Icon as={FaEye} onClick={viewTask} />
                                        {editAccess && (
                                            <Icon
                                                as={BiSolidPencil}
                                                onClick={() => openModal(x)}
                                            />
                                        )}
                                        {hasAccess && (
                                            <Icon
                                                as={MdDeleteOutline}
                                                onClick={() => openModal(x)}
                                            />
                                        )}
                                    </HStack> */}
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
                    onSubmit={() => checkPossibleDeletion()}
                    loading={loading}
                    text={`Are you sure you want to delete this task?`}
                />
            )}
            {isOpens && (
                <ShowPrompt
                    isOpen={isOpens}
                    onClose={onCloses}
                    onSubmit={deleteTask}
                    loading={loading}
                    text={`Are you sure you want to delete this task? <br/> This action cannot be undone`}
                />
            )}
        </Box>
    );
};
