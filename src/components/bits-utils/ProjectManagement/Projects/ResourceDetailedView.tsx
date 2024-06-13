import {
    Box,
    Button,
    HStack,
    Icon,
    Image,
    Select,
    Text,
} from '@chakra-ui/react';
import Pagination from '@components/bits-utils/Pagination';
import { SubSearchComponent } from '@components/bits-utils/SubSearchComponent';
import {
    NewTableState,
    TableData,
    TableRow,
} from '@components/bits-utils/TableData';
import colorSwatch from '@components/generics/colorSwatch';
import { useRouter } from 'next/router';
import React from 'react';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { ProjectView, ResourceCapacityDetailView } from 'src/services';
import { TableCard } from '../Generics/TableCard';
import moment from 'moment';
import { ProjectTabs } from '../Dashboard/ProjectTabs';

export const ResourceDetailedView = ({ resource, userName, projects }) => {
    const router = useRouter();
    const filterByProject = (value) => {
        router.push({
            query: {
                ...router.query,
                subId: value,
            },
        });
    };
    const filterByStatus = (value) => {
        router.push({
            query: {
                ...router.query,
                status: value,
            },
        });
    };
    const statuses = [
        { id: 1, name: 'Not started' },
        { id: 2, name: 'Ongoing' },
        { id: 3, name: 'Completed' },
    ];
    const tableHead = [
        'Task Name',
        'Projects',
        'Total Hours',
        'Start Date',
        'Due Date',
        'Status',
    ];
    return (
        <Box>
            <Box mb="2rem">
                <ProjectTabs
                    name={[
                        'dashboard',
                        'projects',
                        // 'operational-task',
                        'resource-capacity',
                    ]}
                />
            </Box>
            <HStack
                fontSize=".875rem"
                cursor="pointer"
                onClick={() => router.back()}
            >
                <Button bgColor="#f0f0f0" h="1.5rem" w="1.5rem" minW="0">
                    <Icon as={MdOutlineArrowBackIosNew} fontSize=".8rem" />
                </Button>
                <Text color="brand.400" fontWeight={500}>
                    Back
                </Text>
            </HStack>
            <Text color="#263238" fontWeight={500} mt="1rem">
                {userName}
            </Text>
            <HStack py="1rem" justify="space-between">
                <HStack w="55%">
                    <HStack w="fit-content">
                        <Image
                            src="/assets/filter.png"
                            alt="filter"
                            w="1.1rem"
                            h="1.1rem"
                        />
                        <Text fontSize=".8rem" color="#2d3748" fontWeight={500}>
                            Filter
                        </Text>
                    </HStack>
                    <Select
                        fontSize=".8rem"
                        placeholder="Projects"
                        w="256px"
                        bgColor="white"
                        onChange={(e) => filterByProject(e.target.value)}
                    >
                        {projects?.value?.map((x: ProjectView) => (
                            <option value={x.id}>{x.name}</option>
                        ))}
                    </Select>
                    <Select
                        fontSize=".8rem"
                        placeholder="Status"
                        w="137px"
                        bgColor="white"
                        onChange={(e) => filterByStatus(e.target.value)}
                    >
                        {statuses?.map((x) => (
                            <option value={x.id}>{x.name}</option>
                        ))}
                    </Select>
                </HStack>
                <SubSearchComponent />
            </HStack>
            <Box>
                <TableCard tableHead={tableHead}>
                    {resource?.value?.map(
                        (x: ResourceCapacityDetailView, i: number) => {
                            return (
                                <TableRow key={i}>
                                    <TableData
                                        name={x?.taskName}
                                        fontWeight="500"
                                        full
                                        breakWord
                                    />

                                    <TableData
                                        name={
                                            x?.projectName || 'Operational task'
                                        }
                                        fontWeight="500"
                                        full
                                        breakWord
                                    />
                                    <TableData
                                        name={x?.totalHours}
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
                                </TableRow>
                            );
                        },
                    )}
                </TableCard>
                <Pagination data={resource} loadMore />
            </Box>
        </Box>
    );
};
