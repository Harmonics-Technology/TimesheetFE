/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-sparse-arrays */
import { Box, Flex, Select, Text, HStack, Input, Tr } from '@chakra-ui/react';
import {
    TableContract,
    TableContractAction,
    TableData,
    TableState,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import Pagination from '@components/bits-utils/Pagination';
import { useRouter } from 'next/router';
import moment from 'moment';
import {
    ContractView,
    ContractViewPagedCollectionStandardResponse,
} from 'src/services';
import FilterSearch from './FilterSearch';
import { formatDate } from '@components/generics/functions/formatDate';

interface adminProps {
    adminList: ContractViewPagedCollectionStandardResponse;
}

function ViewPayroll({ adminList }: adminProps) {
    console.log({ adminList });
    const router = useRouter();

    return (
        <>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <FilterSearch searchOptions="Search by: Rate, Total Amount, or Status " />
                <Tables
                    tableHead={[
                        'Total Hrs',
                        'Rate',
                        'Total Amount',
                        'Start Date',
                        'End Date',
                        'Payment Date',
                        'Status',
                        'Action',
                    ]}
                >
                    <>
                        {adminList?.data?.value?.map((x: ContractView) => (
                            <Tr key={x.id}>
                                <TableData name={x.name} />
                                <TableData name={x.title} />
                                <TableData name={x.title} />
                                <TableData name={formatDate(x.startDate)} />
                                <TableData name={formatDate(x.endDate)} />
                                <TableData name={formatDate(x.endDate)} />
                                <TableState name={x.status as string} />
                                <TableContractAction id={x.userId} />
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={adminList} />
            </Box>
        </>
    );
}

export default ViewPayroll;
