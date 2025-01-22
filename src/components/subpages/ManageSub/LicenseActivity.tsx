import { Box, Flex, Tr, Text } from '@chakra-ui/react';
import Pagination from '@components/bits-utils/Pagination';
import { TableData } from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import moment from 'moment';
import React from 'react';
import { LicenseNav } from './LicenseNav';
import FilterSearch from '@components/bits-utils/FilterSearch';

export const LicenseActivity = ({ data }) => {
    return (
        <>
            <LicenseNav />
            <Box bgColor="white" borderRadius="8px" pos="relative" p="1rem">
                <Flex justify="space-between" mb="1rem">
                    <Text fontWeight="500" color="#2d3748">
                        Subscription Activities
                    </Text>
                    <FilterSearch noSearch noFilter data={data} />
                </Flex>

                {(data?.value as any)?.length > 0 ? (
                    <Tables
                        tableHead={[
                            'Subscription Type',
                            'Activities',
                            'Date & Time',
                        ]}
                        bg="brand.400"
                        color="white"
                    >
                        <>
                            {data?.value?.map((x) => (
                                <Tr>
                                    <TableData name={x?.licenseType} />
                                    <TableData name={x?.activityNote} full />
                                    <TableData
                                        name={moment(x?.dateCreated).format(
                                            'DD/MM/YYYY',
                                        )}
                                    />
                                </Tr>
                            ))}
                        </>
                    </Tables>
                ) : (
                    <Text
                        my="2rem"
                        textAlign="center"
                        fontWeight="800"
                        color="red"
                    >
                        No activity to show!!!
                    </Text>
                )}

                <Pagination data={data} loadMore />
            </Box>
        </>
    );
};
