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
import React, { useContext } from 'react';
import { ProjectTabs } from '../Dashboard/ProjectTabs';
import moment from 'moment';
import { ProgressBar } from '../Generics/ProgressBar';
import { SubSearchComponent } from '@components/bits-utils/SubSearchComponent';
import { TableRow, TableData } from '@components/bits-utils/TableData';
import { UserContext } from '@components/context/UserContext';
import { useRouter } from 'next/router';
import { TableCard } from '../Generics/TableCard';
import { AddNewTaskDrawer } from '../Modals/AddNewTaskDrawer';
import { AddOperationalTaskDrawer } from '../Modals/AddOperationalTaskDrawer';

export const OperationalTask = () => {
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

    const { user } = useContext(UserContext);
    const role = user?.role?.replaceAll(' ', '');
    return (
        <Box>
            <Box mb="1.5rem">
                <ProjectTabs
                    name={['dashboard', 'projects', 'operational-task']}
                />
            </Box>
            <HStack py="1rem" justify="space-between">
                <HStack w='17%'>
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
            <TableCard tableHead={tableHead}>
                <TableRow>
                    <TableData
                        name="Book a requierment gathering meeting"
                        fontWeight="500"
                        full
                        breakWord
                    />
                    <td style={{ maxWidth: '300px' }}>
                        <HStack color="#c2cfe0" gap=".2rem" flexWrap="wrap">
                            {Array(5)
                                .fill(5)
                                .map((x, i) => (
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
                                        {'Ade Adeyemi'}
                                    </Flex>
                                ))}
                        </HStack>
                    </td>
                    <TableData
                        name={`${'Planning and Scheduling'}`}
                        fontWeight="500"
                        full
                        breakWord
                    />
                    <TableData name={'Admin Depart'} fontWeight="500" />
                    <TableData
                        name={'High'}
                        fontWeight="500"
                        customColor="red"
                    />
                    <TableData
                        name={moment().format('DD/MM/YYYY')}
                        fontWeight="500"
                    />
                    <td>
                        <ProgressBar
                            barWidth={50}
                            showProgress={true}
                            rightText={'100%'}
                            barColor="brand.400"
                        />
                    </td>
                </TableRow>
            </TableCard>
            {isOpen && (
                <AddOperationalTaskDrawer isOpen={isOpen} onClose={onClose} />
            )}
        </Box>
    );
};
