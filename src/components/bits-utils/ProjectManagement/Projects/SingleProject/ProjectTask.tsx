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
import React, { useContext } from 'react';
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

export const ProjectTask = ({ id }: { id: any }) => {
    id = 2;
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
    return (
        <Box>
            <TopBar />
            <HStack py="1rem" justify="space-between">
                <HStack>
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
                    <TableData name="Requirement Gathering" fontWeight="500" />
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
                    <TableData name={`${50} Hrs`} fontWeight="500" />
                    <TableData
                        name={moment().format('DD/MM/YYYY')}
                        fontWeight="500"
                    />
                    <TableData name={4} fontWeight="500" />
                    <NewTableState
                        name="Completed"
                        color={colorSwatch('completed')}
                    />
                    <td>
                        <HStack
                            color="#c2cfe0"
                            onClick={() =>
                                router.push(
                                    `/${role}/project-management/projects/${id}/project-task/${5}`,
                                )
                            }
                        >
                            <Icon as={FaEye} />
                            <Icon as={BiSolidPencil} />
                        </HStack>
                    </td>
                </TableRow>
            </TableCard>
            {isOpen && <AddNewTaskDrawer isOpen={isOpen} onClose={onClose} />}
        </Box>
    );
};
