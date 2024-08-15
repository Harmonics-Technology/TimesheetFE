import React, { useState } from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { TopBar } from './TopBar';
import {
    Box,
    Button,
    HStack,
    Image,
    Select,
    Table,
    Td,
    Text,
    Th,
    Tr,
    useDisclosure,
} from '@chakra-ui/react';
import { SubSearchComponent } from '@components/bits-utils/SubSearchComponent';
import { AddNewTaskDrawer } from '../../Modals/AddNewTaskDrawer';
import { ProjectTaskViewPagedCollection, ProjectView } from 'src/services';
import moment from 'moment';

export const GantChart = ({
    id,
    project,
    tasks,
    users,
    currencies,
}: {
    id: any;
    project: ProjectView;
    tasks: ProjectTaskViewPagedCollection;
    users: any;
    currencies: any;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [data, setData] = useState<any>();
    const [viewMode, setViewMode] = useState(ViewMode.Day);

    const newTasks = tasks?.value?.map((x) => ({
        start: new Date(x?.startDate as string),
        end: new Date(x?.endDate as string),
        name: x.name,
        id: x.id,
        type: 'task',
        progress: x?.percentageOfCompletion,
        isDisabled: true,
        startFormatted: moment(x?.startDate).format('DD/MM/YY'), // Formatted start date
        endFormatted: moment(x?.endDate).format('DD/MM/YY'),
        // dependencies: [x.id],
        project: 'Yomy',
        styles: {
            progressColor: '#ffbb54',
            progressSelectedColor: '#ff9e0d',
        },
    }));

    const renderTaskList = (task) => (
        <Tr fontSize="12px">
            <Td
                noOfLines={1}
                pr="0"
                minW={0}
                w="200px"
                pl=".5rem"
                borderRight="1px solid"
                borderColor="gray.200"
            >
                {task.name}
            </Td>
            <Td
                px="0"
                minW={0}
                w="70px"
                borderRight="1px solid"
                borderColor="gray.200"
                pl=".4rem"
            >
                {task.startFormatted}
            </Td>
            <Td px="0" minW={0} w="70px" pl=".4rem">
                {task.endFormatted}
            </Td>
        </Tr>
    );

    return (
        <Box>
            <TopBar
                currencies={currencies}
                id={id}
                data={project}
                users={users}
            />
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
            <Box w="full" bgColor="white" p="1rem" borderRadius="6px">
                <HStack style={{ marginBottom: '20px' }} justify="flex-end">
                    <Button
                        onClick={() => setViewMode(ViewMode.Day)}
                        bgColor={
                            viewMode === ViewMode.Day ? 'brand.400' : 'gray.200'
                        }
                        fontWeight={400}
                        fontSize="14px"
                    >
                        Day View
                    </Button>
                    <Button
                        onClick={() => setViewMode(ViewMode.Week)}
                        bgColor={
                            viewMode === ViewMode.Week
                                ? 'brand.400'
                                : 'gray.200'
                        }
                        fontWeight={400}
                        fontSize="14px"
                    >
                        Week View
                    </Button>
                    <Button
                        onClick={() => setViewMode(ViewMode.Month)}
                        bgColor={
                            viewMode === ViewMode.Month
                                ? 'brand.400'
                                : 'gray.200'
                        }
                        fontWeight={400}
                        fontSize="14px"
                    >
                        Month View
                    </Button>
                </HStack>
                {(newTasks?.length as any) > 0 ? (
                    <HStack w="full" overflow={'auto'} align="flex-start">
                        <Box w="30%">
                            <Table border="1px solid" borderColor="gray.200">
                                <Tr>
                                    <Th
                                        fontWeight={400}
                                        textTransform="capitalize"
                                        pr="0"
                                        pl=".5rem"
                                        py="1rem"
                                        w="200px"
                                        borderRight="1px solid"
                                        borderColor="gray.200"
                                    >
                                        Name
                                    </Th>
                                    <Th
                                        fontWeight={400}
                                        textTransform="capitalize"
                                        px="0"
                                        w="85px"
                                        borderRight="1px solid"
                                        borderColor="gray.200"
                                        pl=".4rem"
                                    >
                                        From
                                    </Th>
                                    <Th
                                        fontWeight={400}
                                        textTransform="capitalize"
                                        px="0"
                                        w="85px"
                                        pl=".4rem"
                                    >
                                        To
                                    </Th>
                                </Tr>
                                {newTasks?.map(renderTaskList)}
                            </Table>
                        </Box>
                        <Box overflow="auto" w="70%">
                            <Gantt
                                tasks={
                                    newTasks?.sort(
                                        (a, b) =>
                                            (a?.start as any) -
                                            (b?.start as any),
                                    ) as Task[]
                                }
                                // listCellWidth={'0'}
                                fontFamily="'Rubik', sans-serif"
                                viewMode={viewMode}
                            />
                        </Box>
                    </HStack>
                ) : (
                    <HStack h="30vh" justify="center">
                        <Text>No data to show!!!</Text>
                    </HStack>
                )}
            </Box>
            {isOpen && (
                <AddNewTaskDrawer
                    isOpen={isOpen}
                    onClose={onClose}
                    project={project}
                    data={data}
                    isEdit={false}
                    setData={setData}
                />
            )}
        </Box>
    );
};
