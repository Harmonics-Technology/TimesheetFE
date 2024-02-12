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
import { FaEye } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { UserContext } from '@components/context/UserContext';
import { AddNewTaskDrawer } from '../../Modals/AddNewTaskDrawer';
import {
    ProjectTaskAsigneeView,
    ProjectView,
    ProjectTaskView,
    ProjectManagementSettingView,
} from 'src/services';
import { Round } from '@components/generics/functions/Round';
import { TeamTopBar } from './TeamTopBar';

export const TeamProjectTask = ({
    id,
    project,
    tasks,
    users,
    access,
}: {
    id: any;
    project: ProjectView;
    tasks: any;
    users: any;
    access: ProjectManagementSettingView;
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

    const isPm = false;
    const hasAccess =
        access?.projectMembersTaskCreation ||
        (access.assignedPMTaskCreation && isPm);

    return (
        <Box>
            <TeamTopBar data={project} />
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
                                name={moment(x?.startDate).format('DD/MM/YYYY')}
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
                                <HStack color="#c2cfe0">
                                    <Icon as={FaEye} onClick={viewTask} />
                                    <Icon
                                        as={BiSolidPencil}
                                        onClick={() => openModal(x)}
                                    />
                                </HStack>
                            </td>
                        </TableRow>
                    );
                })}
            </TableCard>
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
        </Box>
    );
};
