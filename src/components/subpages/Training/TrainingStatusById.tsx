import { Tr, Box, Text, Td, Flex } from '@chakra-ui/react';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import Pagination from '@components/bits-utils/Pagination';
import { TableData } from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import { formatDate } from '@components/generics/functions/formatDate';
import { useRouter } from 'next/router';
import React from 'react';
import { TrainingAssigneeView } from 'src/services';

export const TrainingStatusById = ({ trainings, trainingName }) => {
    const router = useRouter();
    return (
        <Box
            bgColor="white"
            borderRadius="15px"
            padding="1.5rem"
            boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
        >
            <Box w="full" mb="1rem">
                <LeaveTab
                    tabValue={[
                        {
                            text: 'Training Materials',
                            url: `/training/material`,
                        },
                        {
                            text: 'Training Status',
                            url: `/training/status`,
                        },
                    ]}
                    useStartWith
                />
            </Box>
            <Box>
                <Text
                    color="brand.400"
                    fontWeight={500}
                    fontSize=".8rem"
                    onClick={() => router.back()}
                    cursor="pointer"
                    mb=".5rem"
                >
                    Back
                </Text>
                <Text color="#1a202c" fontWeight={500} fontSize=".8rem">
                    {trainingName}
                </Text>
            </Box>
            <Box>
                <Tables
                    tableHead={['Team Members', 'Status', 'Date Completed']}
                >
                    <>
                        {trainings?.value?.map((x: TrainingAssigneeView) => (
                            <Tr key={x.id}>
                                <TableData name={x.user?.fullName} full />
                                <Td>
                                    <Flex
                                        bgColor={
                                            x?.isStarted
                                                ? '#2383BD'
                                                : x?.isCompleted
                                                ? 'brand.400'
                                                : '#707683'
                                        }
                                        color="white"
                                        borderRadius="5px"
                                        w="fit-content"
                                        h="30px"
                                        px="1rem"
                                        justify="center"
                                        align="center"
                                        textTransform="capitalize"
                                    >
                                        {x.status?.toLowerCase()}
                                    </Flex>
                                </Td>
                                <TableData
                                    name={
                                        x?.isCompleted
                                            ? formatDate(x?.dateCompleted)
                                            : x?.isStarted
                                            ? 'Ongoing'
                                            : 'Not started'
                                    }
                                    full
                                />
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={trainings} loadMore />
            </Box>
        </Box>
    );
};
