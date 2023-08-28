import {
    Flex,
    Box,
    VStack,
    Text,
    HStack,
    Avatar,
    Button,
    Icon,
    Select,
    useDisclosure,
    Image,
} from '@chakra-ui/react';
import { SubSearchComponent } from '@components/bits-utils/SubSearchComponent';
import {
    TableRow,
    TableData,
    NewTableState,
} from '@components/bits-utils/TableData';
import colorSwatch from '@components/generics/colorSwatch';
import moment from 'moment';
import React from 'react';
import { BiSolidPencil } from 'react-icons/bi';
import { FaEye } from 'react-icons/fa';
import { ProgressBar } from '../../Generics/ProgressBar';
import { TableCard } from '../../Generics/TableCard';
import { StatusBadge } from '../../Generics/StatusBadge';
import { TopBar } from './TopBar';
import { AddSubTaskDrawer } from '../../Modals/AddSubTaskDrawer';

export const SingleTask = () => {
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
    return (
        <Box>
            <TopBar />
            <Flex gap=".5rem">
                <VStack w="25%">
                    <Box
                        borderRadius=".2rem"
                        border="1px solid #efefef"
                        bgColor="white"
                        p="1rem"
                    >
                        <Text color="#2d3748" fontSize=".8rem" fontWeight={600}>
                            Requirement Gathering
                        </Text>
                        <Text
                            color="#8c8c8c"
                            fontSize=".68rem"
                            fontWeight={400}
                            my="1rem"
                        >
                            Lorem Ipsum is simply dummy text of the printing and
                            typesetting industry. Lorem Ipsum has been the
                            industry's
                        </Text>
                        <Box w="full" mt="0.5rem">
                            <ProgressBar
                                barWidth={50}
                                showProgress={true}
                                barColor={'brand.400'}
                                leftText="Task Status"
                                rightText={`${100}%`}
                            />
                        </Box>
                    </Box>
                    <VStack
                        borderRadius=".2rem"
                        border="1px solid #efefef"
                        bgColor="white"
                        justify="flex-start"
                        w="full"
                        p="1rem"
                    >
                        <StatusBadge
                            bg="#afb6e5"
                            title="Created:"
                            text={moment().format('DD MMM YYYY')}
                        />
                        <StatusBadge
                            bg="#FFA681"
                            title="Deadline:"
                            text={moment().format('DD MMM YYYY')}
                        />
                        <StatusBadge
                            bg="#4BAEEA"
                            title="Status:"
                            text={'Active'}
                        />
                    </VStack>
                    <Box
                        borderRadius=".2rem"
                        border="1px solid #efefef"
                        bgColor="white"
                        w="full"
                        p="1rem"
                    >
                        <Text color="#2d3748" fontWeight={600} fontSize=".8rem">
                            Assigned Team
                        </Text>

                        {Array(5)
                            .fill(5)
                            .map((x, i) => (
                                <HStack mt=".5rem" gap="1rem">
                                    <Avatar
                                        size={'sm'}
                                        name={'Ade Adeyemi'}
                                        src={'https://bit.ly/dan-abramov'}
                                        border="1px solid white"
                                    />
                                    <Box>
                                        <Text
                                            fontSize=".75rem"
                                            color="#2d3748"
                                            fontWeight={500}
                                        >
                                            {'Ade Adeyemi'}
                                        </Text>
                                        <Text
                                            fontSize=".75rem"
                                            color="#a6acb3"
                                            fontWeight={400}
                                        >
                                            {'Ade Adeyemi'}
                                        </Text>
                                    </Box>
                                </HStack>
                            ))}
                    </Box>
                </VStack>
                <Box
                    borderRadius=".2rem"
                    border="1px solid #efefef"
                    bgColor="white"
                    w="80%"
                    p="1rem"
                >
                    <Text color="#2d3748" fontSize=".8rem" fontWeight={600}>
                        Sub-Task Assigned To Team Members
                    </Text>
                    <HStack justify="flex-end">
                        <Button
                            onClick={onOpen}
                            bgColor="brand.400"
                            color="white"
                            h="2rem"
                            borderRadius=".3rem"
                            fontSize=".8rem"
                        >
                            Add sub-task
                        </Button>
                    </HStack>
                    <HStack py="1rem" justify="space-between">
                        <HStack>
                            <HStack w="full">
                                <Image
                                    src="/assets/filter.png"
                                    alt="filter"
                                    w="1.1rem"
                                    h="1.1rem"
                                />
                                <Text
                                    fontSize=".8rem"
                                    color="#2d3748"
                                    fontWeight={500}
                                >
                                    Filter By
                                </Text>
                            </HStack>
                            <Select fontSize=".8rem" w="full">
                                <option value="option1">Status</option>
                            </Select>
                        </HStack>

                        <HStack>
                            <SubSearchComponent />
                        </HStack>
                    </HStack>
                    <TableCard tableHead={tableHead}>
                        <TableRow>
                            <TableData
                                name="Requirement Gathering"
                                fontWeight="500"
                            />
                            <td style={{ maxWidth: '300px' }}>
                                <HStack
                                    color="#c2cfe0"
                                    gap=".2rem"
                                    flexWrap="wrap"
                                >
                                    <Flex
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
                                <HStack color="#c2cfe0">
                                    <Icon as={FaEye} />
                                    <Icon as={BiSolidPencil} />
                                </HStack>
                            </td>
                        </TableRow>
                    </TableCard>
                </Box>
            </Flex>
            {isOpen && <AddSubTaskDrawer isOpen={isOpen} onClose={onClose} />}
        </Box>
    );
};
