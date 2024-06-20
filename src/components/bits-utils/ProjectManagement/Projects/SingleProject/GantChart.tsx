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
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import { SubSearchComponent } from '@components/bits-utils/SubSearchComponent';
import { AddNewTaskDrawer } from '../../Modals/AddNewTaskDrawer';
import { ProjectTaskViewPagedCollection, ProjectView } from 'src/services';

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

    const newTasks = tasks?.value?.map((x) => ({
        start: new Date(x?.startDate as string),
        end: new Date(x?.endDate as string),
        name: x.name,
        id: x.id,
        type: 'task',
        progress: x?.percentageOfCompletion,
        isDisabled: true,
        // dependencies: [x.id],
        project: 'Yomy',
        styles: {
            progressColor: '#ffbb54',
            progressSelectedColor: '#ff9e0d',
        },
    }));

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
                {(newTasks?.length as any) > 0 ? (
                    <Gantt
                        tasks={
                            newTasks?.sort(
                                (a, b) => (a?.start as any) - (b?.start as any),
                            ) as Task[]
                        }
                    />
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
