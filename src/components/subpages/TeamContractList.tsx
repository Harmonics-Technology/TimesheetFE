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
import FilterSearch from '@components/bits-utils/FilterSearch';

interface adminProps {
    adminList: ContractViewPagedCollectionStandardResponse;
}

function TeamContractList({ adminList }: adminProps) {
    console.log({ adminList });

    return (
        <>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <FilterSearch />
                <Tables
                    tableHead={[
                        'Name',
                        'Job Title',
                        'Start Date',
                        'End Date',
                        'Tenor',
                        'Contract',
                        'Status',
                        // 'Action',
                    ]}
                >
                    <>
                        {adminList?.data?.value?.map((x: ContractView) => (
                            <Tr key={x.id}>
                                <TableData name={x.name} />
                                <TableData name={x.title} />
                                <TableData
                                    name={moment(x.startDate).format(
                                        'DD/MM/YYYY',
                                    )}
                                />
                                <TableData
                                    name={moment(x.endDate).format(
                                        'DD/MM/YYYY',
                                    )}
                                />
                                <TableData
                                    name={x.tenor as unknown as string}
                                />
                                <TableContract url={x.document} />
                                <TableState name={x.status as string} />
                                {/* <TableContractAction id={x.userId} /> */}
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={adminList} />
            </Box>
        </>
    );
}

export default TeamContractList;
