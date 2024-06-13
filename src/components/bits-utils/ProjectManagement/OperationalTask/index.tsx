import {
    Box,
    Button,
    Flex,
    HStack,
    Select,
    useDisclosure,
    Image,
    Text,
} from '@chakra-ui/react';
import React from 'react';
import { ProjectTabs } from '../Dashboard/ProjectTabs';
import moment from 'moment';
import { ProgressBar } from '../Generics/ProgressBar';
import { SubSearchComponent } from '@components/bits-utils/SubSearchComponent';
import { TableRow, TableData } from '@components/bits-utils/TableData';
import { TableCard } from '../Generics/TableCard';
import { AddOperationalTaskDrawer } from '../Modals/AddOperationalTaskDrawer';
import { ProjectTaskAsigneeView, ProjectTaskView } from 'src/services';
import { useRouter } from 'next/router';

export const OperationalTask = ({
    projects,
    users,
    superAdminId,
}: {
    projects: any;
    users: any;
    superAdminId: string;
}) => {
    const tableHead = [
        'Task Name',
        'Task assigned to',
        'Category',
        'Department',
        'Priority',
        'Start Date',
        'Progress Status',
    ];
    const { isOpen, onOpen, onClose } = useDisclosure();

    const router = useRouter();
    const filterByStatus = (val: string) => {
        router.push({
            query: {
                ...router.query,
                status: val,
            },
        });
    };
    return (
        <Box>
            <Box mb="1.5rem">
                <ProjectTabs
                    name={[
                        'dashboard',
                        'projects',
                        // 'operational-task',
                        'resource-capacity',
                    ]}
                />
            </Box>
            <HStack py="1rem" justify="space-between">
                <HStack>
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
                        onChange={(e) => filterByStatus(e.target.value)}
                    >
                        <option value={''}>All</option>
                        <option value={1}>Not Started</option>
                        <option value={2}>In Progress</option>
                        <option value={3}>Completed</option>
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
            <TableCard tableHead={tableHead}>
                {projects?.value?.map((x: ProjectTaskView) => {
                    const priority = x?.taskPriority?.toLowerCase();
                    return (
                        <TableRow>
                            <TableData
                                name={x?.name}
                                fontWeight="500"
                                full
                                breakWord
                            />
                            <td style={{ maxWidth: '300px' }}>
                                <HStack
                                    color="#c2cfe0"
                                    gap=".2rem"
                                    flexWrap="wrap"
                                >
                                    {x?.assignees?.map(
                                        (item: ProjectTaskAsigneeView, i) => (
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
                                                {item?.user?.fullName}
                                            </Flex>
                                        ),
                                    )}
                                </HStack>
                            </td>
                            {/* <TableData
                                name={x?.category}
                                fontWeight="500"
                                full
                                breakWord
                            /> */}
                            <TableData
                                name={`${x?.department} Department`}
                                fontWeight="500"
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
                                name={moment(x?.startDate).format('DD/MM/YYYY')}
                                fontWeight="500"
                            />
                            <td>
                                <ProgressBar
                                    barWidth={x?.progress}
                                    showProgress={true}
                                    rightText={`${x?.progress || 0}%`}
                                    barColor="brand.400"
                                />
                            </td>
                        </TableRow>
                    );
                })}
            </TableCard>
            {isOpen && (
                <AddOperationalTaskDrawer
                    isOpen={isOpen}
                    onClose={onClose}
                    users={users}
                    superAdminId={superAdminId}
                />
            )}
        </Box>
    );
};
